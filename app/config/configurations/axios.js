const axios = require('axios');
const Datastore = require('nedb');
const fs = require('fs');

fs.writeFileSync(`${__dirname}/requests.db`, '');

const db = new Datastore({ filename: `${__dirname}/requests.db`, autoload: true, timestampData: true });
const isCache = process.env.NODE_ENV === 'development';

db.ensureIndex({ fieldName: 'request', unique: true, sparse: true });

function buildRequestUrl(request) {
  const searchParams = new URLSearchParams(request.params);
  return `${request.url}?${searchParams.toString()}`;
}

function setCacheResponse(request, response, logger) {
  const obj = { request, data: response.data };
  db.insert(obj, (err, docs) => {
    if (err) {
      logger.error(err.toString());
    }
  });
}

function getCacheResponse(request, logger) {
  return new Promise((resolve, reject) => {
    db.findOne({ request }, (err, docs) => {
      if (err) {
        logger.error(err.toString());
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

async function requestInterceptor(request, logger) {
  let cachedResponse;
  if (isCache) {
    const key = buildRequestUrl(request);
    cachedResponse = await getCacheResponse(key, logger);

    if (cachedResponse) {
      request.data = cachedResponse.data;
      request.adapter = () => Promise.resolve({
        cached: true,
        data: cachedResponse.data,
        status: request.status,
        statusText: request.statusText,
        headers: request.headers,
        config: request,
        request,
      });
    }
  }
  logger.info(`${cachedResponse ? 'CACHE: ' : ''}requesting ${request.method} to ${request.url}`);
  return request;
}

async function responseInterceptor(response, logger) {
  if (isCache && !response.cached) {
    const key = buildRequestUrl(response.config);
    setCacheResponse(key, response, logger);
  }
  logger.info(`${isCache ? 'CACHED: ' : ''} response status ${response.status} from ${response.config.url}`);
  return response;
}

function requestError(error, logger) {
  logger.error(`requesting ${error.method} to ${error.url}`);
  return Promise.reject(error);
}

function responseError(error, logger) {
  logger.error(`response status ${error.status} from ${error.config.url}`);
  return Promise.reject(error);
}

function configureAxiosInterceptors(instance, logger) {
  instance.interceptors.request.use(
    (request) => requestInterceptor(request, logger),
    (error) => requestError(error, logger),
  );
  instance.interceptors.response.use(
    (response) => responseInterceptor(response, logger),
    (error) => responseError(error, logger),
  );
}

function createInstance(logger, config) {
  const instance = axios.create({
    baseURL: config.POE_URL,
    timeout: 1000,
    headers: {
      Cookie: `POESESSID=${config.POESESSID}`,
    },
  });

  configureAxiosInterceptors(instance, logger);
  return instance;
}

module.exports = createInstance;

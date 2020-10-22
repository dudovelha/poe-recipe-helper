const { config, axios, logger } = require('../config/manager');
const priceQueryBuilder = require('./priceQueryBuilder');

const requestQueue = [];
let requestIntervalFn;

function intercept(error, requestObj) {
  logger.error(error.toString());
  if (error.response.status === 429) {
    // this means we exceeded the api rate limit, pause for a minute and continue
    clearInterval(requestIntervalFn);
    // eslint-disable-next-line no-use-before-define
    requestIntervalFn = setInterval(startRequesting, 60 * 1000);
    requestQueue.unshift(requestObj);
  } else {
    requestObj.reject();
  }
}

function request() {
  const nextRequest = requestQueue.shift();
  if (nextRequest) {
    axios.poe[nextRequest.method](nextRequest.url, nextRequest.params)
      .then((response) => {
        nextRequest.resolve(response);
        // bypasses the timeout in case the response came from the cache
        if (response.cached) request();
      })
      .catch((error) => { intercept(error, nextRequest); });
  }
}

function startRequesting() {
  requestIntervalFn = setInterval(request, config.PRICE_INTERVAL);
}

class PriceAPI {
  static async getTradeIds(item) {
    let promiseResolve; let promiseReject;
    const requestPromise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    const requestObj = {
      url: config.TRADE_API_URL + config.LEAGUE,
      params: priceQueryBuilder.build(item),
      method: 'post',
      resolve: promiseResolve,
      reject: promiseReject,
    };
    requestQueue.push(requestObj);
    const response = await requestPromise;
    return {
      id: response.data.id,
      results: response.data.result,
    };
  }

  static async getTradeObjects(id, keys) {
    let promiseResolve; let promiseReject;
    const requestPromise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    const requestObj = {
      url: config.TRADE_FETCH_API_URL + keys.join(','),
      params: { query: id },
      method: 'get',
      resolve: promiseResolve,
      reject: promiseReject,
    };
    requestQueue.unshift(requestObj);
    const response = await requestPromise;
    return response.data.result;
  }

  static getPricePool() {
    return requestQueue;
  }
}

startRequesting();
module.exports = PriceAPI;

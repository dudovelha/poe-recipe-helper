const { config, axios } = require('../config/manager');
const priceQueryBuilder = require('./priceQueryBuilder');

const requestQueue = [];

function request() {
  const nextRequest = requestQueue.shift();
  if (nextRequest) {
    axios.poe[nextRequest.method](nextRequest.url, nextRequest.params)
      .then(nextRequest.resolve)
      .catch(nextRequest.reject);
  }
}

setInterval(request, config.PRICE_INTERVAL);

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
    requestQueue.push(requestObj);
    const response = await requestPromise;
    return response.data.result;
  }

  static getPricePool() {
    return requestQueue;
  }
}

module.exports = PriceAPI;

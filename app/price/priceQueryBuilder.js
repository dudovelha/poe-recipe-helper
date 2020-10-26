const SORT = { price: 'asc' };

function buildCommonRequest(requestObj) {
  return {
    query: {
      status: { option: 'online' },
      ...requestObj,
    },
    sort: SORT,
  };
}

function buildSocketsFilter(sockets) {
  const keys = Object.keys(sockets);
  let biggest = 0;

  keys.forEach((key) => {
    const links = sockets[key].length;
    if (sockets[key].length > biggest) {
      biggest = links;
    }
  });

  return {
    filters: {
      links: {
        min: biggest,
        max: biggest,
      },
    },
  };
}

function buildCorruptionFilter(corrupted) {
  return {
    filters: {
      corrupted: {
        option: corrupted ? 'true' : 'false',
      },
    },
  };
}

function buildCurrencyRequest(item) {
  return buildUniqueRequest(item);
}

function buildUniqueRequest(item) {
  const requestObj = {};
  if (item.name) requestObj.name = item.name;
  if (item.type) requestObj.term = item.baseType;
  if (item.sockets) {
    requestObj.filters = {};
    requestObj.filters.socket_filters = buildSocketsFilter(item.sockets);
  }

  if (!requestObj.filters) requestObj.filters = {};
  requestObj.filters.misc_filters = buildCorruptionFilter(item.corrupted);
  return buildCommonRequest(requestObj);
}

function buildGemRequest(item) {

}

function buildRareRequest(item) {

}

class PriceQueryBuilder {
  static build(item) {
    switch (item.type) {
      case 'currency':
      case 'divination card':
        return buildCurrencyRequest(item);
      case 'unique':
        return buildUniqueRequest(item);
      case 'gem':
        return buildGemRequest(item);
      case 'normal':
      case 'magic':
      case 'rare':
        return buildRareRequest(item);
      default:
        return buildUniqueRequest(item);
    }
  }
}

module.exports = PriceQueryBuilder;

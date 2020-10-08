const logger = require('../config/configurations/logger');

function convertFrameType(frameType) {
  switch (frameType) {
    case 0:
      return 'normal';
    case 1:
      return 'magic';
    case 2:
      return 'rare';
    case 3:
      return 'unique';
    case 4:
      return 'gem';
    case 5:
      return 'currency';
    case 6:
      return 'divination card';
    case 7:
      return 'quest item';
    case 8:
      return 'prophecy';
    case 9:
      return 'relic';
    default:
      return 'unknown';
  }
}

function convertName(name, typeLine) {
  return [name, typeLine].filter((string) => string).join(' ');
}

function getProperty(name, item) {
  if (!item.properties) return '';
  const property = item.properties.find((prop) => prop.name === name);
  return property ? property.values[0][0] : '';
}

function convertSockets(sockets) {
  const newSockets = {};
  if (sockets) {
    sockets.forEach((socket) => {
      if (!newSockets[socket.group]) newSockets[socket.group] = [];
      newSockets[socket.group].push(socket.sColour);
    });
  }
  return newSockets;
}

function convertInfluences(influences) {
  let newInfluence = [];
  if (influences) {
    newInfluence = Object.keys(influences);
  }
  return newInfluence;
}

class itemAdapter {
  static toItem(item) {
    const newItem = {
      stashId: item.stashId,
      size: { w: item.w, h: item.h },
      position: { x: item.x, y: item.y },
      fullName: convertName(item.name, item.typeLine),
      type: convertFrameType(item.frameType),
      itemType: item.itemType,
      identified: item.identified,
      corrupted: item.corrupted,
      ilvl: item.ilvl,
      id: item.id,
    };

    const quality = getProperty('Quality', item).replace(/\D+/g, '');
    if (item.typeLine) newItem.baseType = item.typeLine;
    if (item.influences) convertInfluences(newItem.influences);
    if (quality) newItem.quality = quality;
    if (item.sockets) newItem.sockets = convertSockets(item.sockets);

    return newItem;
  }

  static toItemType(itemType) {
    return {
      id: itemType.name,
      itemType: itemType.itemType,
      baseType: itemType.baseType,
    };
  }
}

module.exports = itemAdapter;

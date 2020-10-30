module.exports = {
  waitFor: (conditionFn, interval) => {
    return new Promise((resolve) => {
      const intervalFn = setInterval(() => {
        if (conditionFn()) {
          clearInterval(intervalFn);
          resolve();
        }
      }, interval);
    });
  },

  removeArrayDuplicates: (array, property) => {
    const newArray = [];
    array.forEach((newValue) => {
      if (!newArray.some((value) => value[property] === newValue[property])) {
        newArray.push(newValue);
      }
    });
    return newArray;
  }

};
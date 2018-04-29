module.exports = (arr, n) => arr.reduce((prevI, curr, i) => Math.abs(curr - n) < Math.abs(arr[prevI] - n) ? i : prevI, 0);

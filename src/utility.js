/**
 * This serialzes an object into a URL-encoded query string.
 * @param {object} obj - Object to serialize.
 * @return {string} - Serialized string. {foo: "hi there", bar: "100%" } =>
 *  'foo=hi%20there&bar=100%25'
 */
export function serialize(obj) {
  const str = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }
  return str.join('&');
}

/**
 * Compares two arrays for equality.
 * @param {array} a - The first array to compare.
 * @param {array} b - The second array to compare.
 * @return {boolean}
 */
export function areArraysEqual(a, b) {
  if (!a || !b) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Returns true if number is odd.
 * @param {number} num - Number to test.
 * @return {boolean}
 */
export function isOdd(num) {
  return (num % 2) === 1;
};

/**
 * Returns true if number is even.
 * @param {number} num - Number to test.
 * @return {boolean}
 */
export function isEven(num) {
  return (num % 2) === 0;
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export function shuffleArray(source) {
  const array = source.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
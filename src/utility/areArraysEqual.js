/**
 * Compares two arrays for equality.
 * @param {array} a - The first array to compare.
 * @param {array} b - The second array to compare.
 * @return {boolean}
 */
function areArraysEqual(a, b) {
  if (!a || !b) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default areArraysEqual;

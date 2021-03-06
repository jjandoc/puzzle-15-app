/**
 * Randomize array element order in-place. Using Durstenfeld shuffle algorithm.
 * @param {array} source - Array to be shuffled.
 * @return {array} - A new, shuffled copy of the original array.
 */
function shuffleArray(source) {
  const array = source.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default shuffleArray;

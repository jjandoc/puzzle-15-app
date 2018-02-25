import React, { Component } from 'react';
import Board from './components/Board/Board';
import areArraysEqual from './utility/areArraysEqual';
import isEven from './utility/isEven';
import isOdd from './utility/isOdd';
import serialize from './utility/serialize';
import shuffleArray from './utility/shuffleArray';
import { UNSPLASH_API_ID, UNSPLASH_APP_ID } from './constants/config';
import './App.css';

class App extends Component {
  constructor() {
    super();
    // Build out the initial array of numbered squares.
    // TODO: It'd be great to have the width and height of the puzzle board in
    //   squares be inputable by the user.
    const initialPositions = [];
    const totalSquares = 16;
    for (let i = 1; i < totalSquares; i++) {
      initialPositions.push(i);
    }
    initialPositions.push(null);

    this.state = {
      history: [],
      initialPositions: initialPositions,
      isLoading: false,
      puzzleColumns: 4,
      puzzleImage: null,
      puzzleRows: 4,
      isShowingNumbers: false
    };
  }

  /**
   * Fetches a random image from the Unsplash API.
   * @return {Promise.<Object>} - A promise that resolves with an object
   *   containing the image URL and information about the photographer.
   */
  getRandomImage() {
    const options = {
      client_id: UNSPLASH_API_ID,
      h: 500,
      w: 500
    };
    const requestUrl = `https://api.unsplash.com/photos/random?${serialize(
      options
    )}`;
    return fetch(requestUrl)
      .then(res => res.json())
      .then(result => {
        return {
          photo: result.urls.custom,
          photographer: {
            name: result.user.name,
            link: result.user.links.html
          }
        };
      });
  }

  /**
   * Determines if a puzzle state is solvable. See:
   * https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
   * for logic behind solvability. The TL;DR is:
   *   a. If the grid width is odd, then the number of inversions in a solvable
   *      situation is even.
   *   b. If the grid width is even, and the blank is on an even row counting
   *      from the bottom (second-last, fourth-last etc), then the number of
   *      inversions in a solvable situation is odd.
   *   c. If the grid width is even, and the blank is on an odd row counting
   *      from the bottom (last, third-last, fifth-last etc) then the number of
   *      inversions in a solvable situation is even.
   * @param {array} puzzleState
   * @return {boolean}
   */
  isSolvable(puzzleState) {
    // Determine the number of inversions.
    const inversions = puzzleState.reduce((sum, item, i, arr) => {
      if (item) {
        for (let j = i; j < arr.length; j++) {
          if (arr[j] && item > arr[j]) sum++;
        }
      }
      return sum;
    }, 0);

    // If the grid width is odd, the logic is pretty simple.
    if (isOdd(this.state.puzzleColumns)) {
      return isEven(inversions);
    }

    // Otherwise, determine whether the blank space is on an odd or even row,
    // counting from the end.
    const isBlankOnOddRowFromEnd = isOdd(
      Math.floor(
        (puzzleState.length - 1 - puzzleState.indexOf(null)) /
          this.state.puzzleColumns
      ) + 1
    );
    return isBlankOnOddRowFromEnd ? isEven(inversions) : isOdd(inversions);
  }

  /**
   * Shuffles the puzzle until it is able to return a solvable configuration.
   * @return {array}
   */
  getShuffledPuzzle() {
    let puzzleState = this.state.initialPositions.slice();
    do {
      puzzleState = shuffleArray(puzzleState);
    } while (!this.isSolvable(puzzleState));
    return puzzleState;
  }

  /**
   * Shuffles the puzzle and resets the history.
   */
  shufflePuzzle() {
    const newPuzzleState = this.getShuffledPuzzle();
    this.setState({
      history: [newPuzzleState]
    });
  }

  /**
   * Fetches a new image, shuffles the puzzle, and resets the history.
   * TODO: Add some styles for the loading state.
   */
  refreshPuzzle() {
    this.setState({ isLoading: true });
    this.getRandomImage().then(image => {
      const newPuzzleState = this.getShuffledPuzzle();
      this.setState({
        isLoading: false,
        puzzleImage: image,
        history: [newPuzzleState]
      });
    });
  }

  /**
   * Updates the state of the puzzle by swapping a selected tile's position
   * with that of the blank space, and adds that state to the history.
   * @param {number} i - Index of the square to be moved.
   * TODO: It'd be nice to queue up moves in case the user is clicking squares
   *   faster than it takes the square animation to complete.
   */
  handleSquareClick(i) {
    const history = this.state.history;
    const oldPuzzleState = history[history.length - 1];
    const newPuzzleState = history[history.length - 1].slice();
    const blankIndex = oldPuzzleState.indexOf(null);
    newPuzzleState[blankIndex] = oldPuzzleState[i];
    newPuzzleState[i] = null;
    this.setState({
      history: history.concat([newPuzzleState])
    });
  }

  /**
   * Builds out the attribution link for Unsplash and the photographer.
   * @return {element|null}
   */
  getAttribution() {
    const image = this.state.puzzleImage;
    if (!image) {
      return null;
    }
    const sourceParams = {
      utm_source: UNSPLASH_APP_ID,
      utm_medium: 'referral'
    };
    const photographerLink = `${image.photographer.link}?${serialize(
      sourceParams
    )}`;
    return (
      <p className="attribution">
        Photo by <a href={photographerLink}>{image.photographer.name}</a> on{' '}
        <a href={`https://unsplash.com/?${serialize(sourceParams)}`}>
          Unsplash
        </a>
      </p>
    );
  }

  /**
   * Toggles whether to show or hide the numbers of the squares.
   * @param {Event} event
   */
  toggleNumbers(event) {
    this.setState({
      isShowingNumbers: event.target.checked
    });
  }

  componentWillMount() {
    this.refreshPuzzle();
  }

  render() {
    const history = this.state.history;
    const puzzleState = history[history.length - 1] || [];
    const isSolved = areArraysEqual(this.state.initialPositions, puzzleState);
    const attribution = this.getAttribution();
    return (
      <div className="App">
        <div className="board-container">
          {isSolved ? (
            <div className="congrats">
              <div className="congrats-body">
                <h1 className="congrats-title">Dunzo!</h1>
                <p className="congrats-score">
                  Finished in {history.length - 1} moves.
                </p>
              </div>
              <div
                className="congrats-solution"
                style={{
                  backgroundImage: this.state.puzzleImage
                    ? `url(${this.state.puzzleImage.photo})`
                    : null
                }}
              />
            </div>
          ) : null}
          <Board
            puzzleState={puzzleState}
            rows={this.state.puzzleColumns}
            columns={this.state.puzzleColumns}
            image={this.state.puzzleImage ? this.state.puzzleImage.photo : null}
            onClick={i => this.handleSquareClick(i)}
            isShowingNumbers={this.state.isShowingNumbers}
            disabled={isSolved}
          />
        </div>
        <div className="controls">
          <button onClick={() => this.shufflePuzzle()}>Reshuffle</button>
          <button onClick={() => this.refreshPuzzle()}>New Puzzle</button>
          <label>
            <input
              type="checkbox"
              onChange={e => this.toggleNumbers(e)}
              checked={this.state.isShowingNumbers}
            />
            <span>Show Numbers</span>
          </label>
        </div>
        {attribution}
      </div>
    );
  }
}

export default App;

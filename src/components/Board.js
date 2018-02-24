import React, { Component } from 'react';
import Square from './Square.js';
import './Board.css';

/** @enum {string} */
export const Adjacency = {
  ABOVE: 'above',
  BELOW: 'below',
  LEFT: 'left',
  RIGHT: 'right'
};

class Board extends Component {
  /**
   * Calculates the background position of a given square.
   * @param {number} value - The value of the square. 
   * @return {string|null} - Either a background position string, or `null` if
   *   there is no passed value.
   */
  getBackgroundPosition(value) {
    if (!value) {
      return null;
    }
    const {rows, columns} = this.props;
    // TODO: I'm not quite sure why I need to subtract 1 from columns and rows,
    // but it's necessary to get the image to align properly.
    const horizontalOffset = (100 / (columns - 1)) * ((value - 1) % columns);
    const verticalOffset = (100 / (rows - 1)) *
        (Math.floor((value - 1) / rows));
    return `${horizontalOffset}% ${verticalOffset}%`;    
  }

  /**
   * Determines a given square's adjacency to the blank space.
   * @param {number} index - Index of the square to check.
   * @return {string|null} - Either `above`, `left`, `right`, `below`, or `null`
   */
  getAdjacencyToBlank(index) {
    const {puzzleState, rows} = this.props;
    const blankIndex = puzzleState.indexOf(null);
    if (blankIndex + 1 === index && (blankIndex + 1) % rows !== 0) {
      return Adjacency.RIGHT;
    }
    if (blankIndex - 1 === index && blankIndex % rows !== 0) {
      return Adjacency.LEFT;
    }
    if (blankIndex - rows === index) {
      return Adjacency.ABOVE;
    }
    if (blankIndex + rows === index) {
      return Adjacency.BELOW;
    }
    return null;
  }

  render() {
    const squareStyles = {
      backgroundSize: `${100 * this.props.rows}%`,
      height: `${100 / this.props.rows}%`,
      width: `${100 / this.props.columns}%`
    }
    
    return (
      <div className="board-wrapper">
        <div className="board">
          {this.props.puzzleState.map((item, i, arr) => {
            const squareStyle = Object.assign({}, squareStyles, {
              backgroundPosition: this.getBackgroundPosition(item),
              backgroundImage: item ? `url(${this.props.image})` : null
            });
            const adjacency = this.getAdjacencyToBlank(i);
            return <Square
                value={item} 
                key={i} 
                adjacency={adjacency}
                onClick={() => this.props.onClick(i)}
                disabled={this.props.disabled || !this.getAdjacencyToBlank(i)}
                style={squareStyle}
                isShowingNumber={this.props.isShowingNumbers} />
          })}
        </div>
      </div>
    );
  }
}

export default Board;
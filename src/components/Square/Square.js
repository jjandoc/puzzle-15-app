import React, { Component } from 'react';
import Adjacency from '../../constants/Adjacency';
import './Square.css';

class Square extends Component {
  constructor() {
    super();
    this.state = {
      animationClass: ''
    };
  }

  /**
   * Animates the tile as it moves by applying a css class and then removing it.
   * Once the animation is complete (arbitrarily defined as lasting 250ms in
   * the CSS), remove the animating class and fire any passed click handler as
   * a callback.
   * TODO: It would be nice if we could shift multiple squares on a click,
   *   i.e. if the user clicks a square two rows above the blank, it and the
   *   square below it both shift down.
   */
  handleClick() {
    switch (this.props.adjacency) {
      case Adjacency.RIGHT:
        this.setState({ animationClass: 'slideLeft' });
        break;
      case Adjacency.LEFT:
        this.setState({ animationClass: 'slideRight' });
        break;
      case Adjacency.ABOVE:
        this.setState({ animationClass: 'slideDown' });
        break;
      case Adjacency.BELOW:
        this.setState({ animationClass: 'slideUp' });
        break;
      default:
        return;
    }
    // TODO: Probably best to use requestAnimationFrame here.
    window.setTimeout(() => {
      this.setState({ animationClass: '' });
      this.props.onClick();
    }, 250);
  }

  render() {
    const squareStyle = Object.assign(
      {
        borderRadius: 0
      },
      this.props.style
    );
    return (
      <button
        className={['square', this.state.animationClass].join(' ')}
        style={squareStyle}
        onClick={() => this.handleClick()}
        disabled={this.props.disabled}
      >
        {this.props.isShowingNumber ? this.props.value : null}
      </button>
    );
  }
}

export default Square;

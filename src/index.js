import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import { people } from './people';
import { shuffle } from './shuffle';

function Square(props) {
  const { type, value, matched, selected } = props.square // const type = props.square.type & so on...

  let className = ''

  if (selected) {
    className = 'selected'
  }

  if (matched) {
    className = 'matched'
  }

  return (
    <button className={`square ${className}`} onClick={props.onClick}>
     {
        type === 'image'
          ? <img src={value} className='square-image' />
          : <div className='square-text'>{value}</div>
     }
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();

    this.state = {
      squares: shuffle(this.generateSquares()),
      gameResult: 'Score: '
    };

  }

  generateSquares() {
    let result = [];

    for (let i = 0; i < people.length; i++) {
      let personName = {
        type: 'name',
        value: people[i].name,
        selected: false,
      };

      let personImage = {
        type: 'image',
        value: people[i].image,
        selected: false,
      };

      result.push(personName);
      result.push(personImage);
    }

    return result;
  }

  handleClick(i) {
    let squares = this.state.squares.slice() // make a copy for immutability
    let gameResult = this.state.gameResult
    squares[i].selected = !squares[i].selected

    const selection = this.state.squares.filter(s => s.selected)

    if (selection.length === 2) {
      if (this.doesSelectionMatch(selection)) {
        squares = squares.map(s => {
          if (s.selected)
            return { ...s, selected: false, matched: true }
          else
            return s
        })

        gameResult += this.getGameResult(squares);
      }
    }

    this.setState({ squares, gameResult });
  }

  doesSelectionMatch(selection) {
    const personToMatch = people.find(person => {
      if (selection[0].type === 'name') {
        return selection[0].value === person.name
      } else {
        return selection[0].value === person.image
      }
    })

    if (selection[1].type === 'name') {
      return selection[1].value === personToMatch.name
    } else {
      return selection[1].value === personToMatch.image
    }
  }

  getGameResult(squares) {
    let matchedS = squares.filter(s => s.matched);
    if (matchedS.length !== squares.length) {
      return '+1'
    } else {
      return 'YOU WIN!'
    }

  }

  renderSquare(i) {
    return  <Square
              key={`square-${i}`}
              square={this.state.squares[i]}
              onClick={() => this.handleClick(i)}
            />;
  }

  render() {
    const matrix = [0, 1, 2, 3];
    let gameResult = this.state.gameResult;

    return (
      <div>
        <h3 className="status">{gameResult}</h3>
        {
          matrix.map((i, j) =>
            <div className="board-row" key={'board-row-' + i}>
              { matrix.map(i => this.renderSquare(j * 4 + i)) }
            </div>
          )
        }
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <h1 className="game-info">
          Social Genius Game
        </h1>

        <div className="game-board">
          <Board />
        </div>

      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

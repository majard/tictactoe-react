import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
             value={this.props.squares[i]}
             onClick = {() => this.props.onClick(i)}
           />;
  }


  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let squares = clearTable();
    this.state = {
      history: [{squares: squares}],
      xIsNext: true,
      winner: null,
      stepNumber: 0,
    };
  }
  renderResetButton(){
    return (
      <button className="reset" onClick={() => this.reset()}>
        Reset
      </button>
      )
  }

  reset(){
    this.setState({
      history: [{squares: clearTable()}],
      xIsNext: true,
      winner: null,
      stepNumber: 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    console.log(current);
    const squares = current.squares.slice();
    if (squares[i] || this.state.winner) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let winner = calculateWinner(squares);
    this.setState({
      history: history.concat([{squares: squares}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      winner: winner
    });
  }

  jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let status;

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick = {() => this.jumpTo(move)}>{desc} </button>
        </li>
      );
    });

    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    }
    else {
      status = 'Next move: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="status">{this.renderResetButton()}</div>           <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function clearTable(){
  return Array(9).fill(null)
}

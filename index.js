import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const ARROW_LEFT_CODE = 37;
const ARROW_UP_CODE = 38;
const ARROW_RIGHT_CODE = 39;
const ARROW_DOWN_CODE = 40;

function GameConfig(props) {
    return (
      <div>
        <form onSubmit={props.handleInitGame}>
          <div>
          <label>Chessboard size (nxn):
            <input type="number" onChange={props.handleBoardSizeChange} min={1}/>
          </label>
          </div>
          <div>
          <label>Number of available steps:
            <input type="number" onChange={props.handleAvailableStepsChange} min={1} />
          </label>
          <div>
            <input type="submit" value="OK" />
          </div>
          </div>
        </form>
      </div>
    );
}

function Cell(props) {
  return <button className={"square" + (props.selected ? " selected" : "")}></button>
}

function Board(props) {

    const selectedRow = props.selectedRow;
    const selectedCol = props.selectedCol;
    const boardSize = props.boardSize;
    const matrix = Array(boardSize).fill(Array(boardSize).fill(0))

    return ((matrix.map((row, rowIdx) => {
          return <div key={rowIdx}>
            {row.map((col, colIdx) =>
              <Cell key={rowIdx + "-" + colIdx} x={colIdx} y={rowIdx} selected={rowIdx === selectedRow && colIdx === selectedCol}/>)}
            </div>
        }
      )));
}

function GameResults(props) {

  return (
    <div>
      <h1>Thank you! Your steps:</h1>
      <div>{props.steps.map((x) => <span>{"{"+x.row + "," + x.col+"}"}</span>)}</div>
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      boardSize: null,
      availableSteps: null,
      selectedRow: 0,
      selectedCol: 0,
      steps: [{row: 0, col: 0}]
    };

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handleAvailableStepsChange = this.handleAvailableStepsChange.bind(this);
    this.handleInitGame = this.handleInitGame.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleBoardSizeChange(event) {
    this.setState({boardSize: Number(event.target.value)});
  }

  handleAvailableStepsChange(event) {
    this.setState({availableSteps: Number(event.target.value)});
  }

  handleInitGame(event) {
    event.preventDefault();
    if (this.state.availableSteps && this.state.boardSize) {
      this.setState({gameStarted: true});
    }
  }

  handleKeyUp(event) {

    if (!this.state.gameStarted || this.state.availableSteps === 0) {
      return;
    }

    const currentCol = this.state.selectedCol;
    const currentRow = this.state.selectedRow;
    const boardSize = this.state.boardSize;
    const availableSteps = this.state.availableSteps;
    let steps = this.state.steps;
    let nextCol = currentCol;
    let nextRow = currentRow;

    if (event.keyCode === ARROW_LEFT_CODE && currentCol > 0) {
      nextCol = currentCol - 1;
    } else if (event.keyCode === ARROW_UP_CODE && currentRow > 0) {
      nextRow = currentRow - 1;
    } else if (event.keyCode === ARROW_RIGHT_CODE && currentCol < boardSize-1) {
      nextCol = currentCol + 1;
    } else if (event.keyCode === ARROW_DOWN_CODE && currentRow < boardSize-1) {
      nextRow = currentRow + 1;
    }

    if (nextCol !== currentCol || nextRow !== currentRow) {
      steps.push({row: nextRow, col: nextCol})
      this.setState({selectedCol: nextCol, selectedRow: nextRow, availableSteps: availableSteps-1, steps: steps})
    }
  }

  render() {
    return (
      <div className="game" onKeyUp={this.handleKeyUp}>
        {!this.state.gameStarted && <div>
          <GameConfig
            handleBoardSizeChange={this.handleBoardSizeChange}
            handleAvailableStepsChange={this.handleAvailableStepsChange}
            handleInitGame={this.handleInitGame}/>
        </div>}

        {this.state.gameStarted && this.state.availableSteps > 0 && <div className="game-board">
          <Board boardSize={this.state.boardSize} selectedRow={this.state.selectedRow} selectedCol={this.state.selectedCol}/>
        </div>}

        {this.state.availableSteps === 0 && <div>
          <GameResults steps={this.state.steps}/>
        </div>}
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

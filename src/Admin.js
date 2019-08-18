import React, { Component } from 'react';
import { Tile } from './Tiles';
import './Puzzle.css';
import './Admin.css';

class Admin extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        minutes: props.minutes,
        numx: props.numx,
        numy: props.numy,
        tolerance: props.tolerance
      };
    }

    makeGrid(numy, numx) {
        let grid = [];
        for (let y = 0; y < numy; y++) {
            let row = [];
            for (let x = 0; x < numx; x++) {
                row.push(<Tile key={`${y}-${x}`} />);
            }
            grid.push(<div className="blockRow" key={y}>{row}</div>);
        }
        return(grid);
    }

    increment(item, max) {
        let val = this.state[item];
        if (val < max) {;
            this.props.parent.setState({[item]: val + 1});
            this.setState({[item]: val + 1})
        }
    }

    decrement(item, min) {
        let val = this.state[item];
        if (val > min) {
            this.props.parent.setState({[item]: val - 1});
            this.setState({[item]: val - 1});
        }
    }
    
  render() {
    const {minutes} = this.state;
    const {numx} = this.state;
    const {numy} = this.state;
    const {tolerance} = this.state;
    let grid = this.makeGrid(numy, numx);
    return (
      <div className="Admin">
          <div className="Text">Admin</div>
          <div className="TextBox">
            <div className="Text">Time Limit to Solve (in minutes):</div>
            <div className='Click' onClick={() => this.decrement('minutes', 1)}>⬇️</div>
            <div className="Text">{minutes}</div>
            <div className='Click' onClick={() => this.increment('minutes', 20)}>⬆️</div>
          </div>
          <div className="TextBox">
            <div className="Text">Num Across:</div>
            <div className='Click' onClick={() => this.decrement('numx', 2)}>⬇️</div>
            <div className="Text">{numx}</div>
            <div className='Click' onClick={() => this.increment('numx', 50)}>⬆️</div>
          </div>
          <div className="TextBox">
            <div className="Text">Num Down:</div>
            <div className='Click' onClick={() => this.decrement('numy', 2)}>⬇️</div>
            <div className="Text">{numy}</div>
            <div className='Click' onClick={() => this.increment('numy', 50)}>⬆️</div>
          </div>
          <div className="TextBox">
            <div className="Text">Max Empty Spaces:</div>
            <div className='Click' onClick={() => this.decrement('tolerance', 10)}>⬇️</div>
            <div className="Text">{tolerance}%</div>
            <div className='Click' onClick={() => this.increment('tolerance', 50)}>⬆️</div>
          </div>
          <div className="TextBox">
            <div className="Text">Preview:</div>
            <button onClick={() => this.props.start()}>Start</button>
          </div>
          <div className="grid">{grid}</div>
      </div>
    );
  }
}

export default Admin;

/*eslint default-case:0*/
import React, { Component } from 'react';
import {Tile, LightTile, PowerTile, WireTile} from './Tiles';
import './Puzzle.css';

let moment = require('moment');

const TILE_TYPE = {
  POWER: 'power',
  WIRE: 'wire',
  LIGHT: 'light',
  BLOCK: 'block',
  EMPTY: 'empty'
};

const TILE_COLORS = ['Red', 'Yellow', 'Blue', 'Green', 'White', 'Purple'];

const EMPTY_STYLES = ['Block1', 'Block2', 'Block3', 'Block4', 'Block5', 'Empty'];

class Puzzle extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      deadline: moment().add(props.minutes,'minutes'),
      minutes: props.minutes,
      seconds: 0,
      numx: props.numx,
      numy: props.numy,
      tolerance: props.tolerance
    };
    let count = 0;
    do {
        console.log('setting up grid');
        this.state.grid = [];
        this.state.lightCount = 0;
        this.state.lightCount = this.setupGrid();
        count++;
    } while (this.countBlank() > props.tolerance || count < 10);
    this.litCount = 0;
    this.interval=setInterval(this.update.bind(this),1000);
  }

    countBlank() {
        let count = 0;
        let {grid} = this.state;
        grid.forEach(row => {
          row.forEach(t => {
            count += (t.tile === TILE_TYPE.EMPTY) ? 1 : 0;
          });
        });
    
        return count;
    }

	countConnections(x,y) {
    let count = 0;
    let {grid} = this.state;
    grid[y][x].connections.forEach(c => {count += c;});
		return count;
	}

	makeLight(x,y,from) {
    let {grid} = this.state;
    grid[y][x].color = TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)];
		grid[y][x].tile = TILE_TYPE.LIGHT;
	}

  placeLight(x,y,from) {
    const {numx} = this.state;
    const {numy} = this.state;
    let {grid} = this.state;
		if (x < 0 || x >= numx || y < 0 || y >= numy)
			return 0;

		if (grid[y][x].tile !== TILE_TYPE.EMPTY)
			return 0;

		grid[y][x].tile = TILE_TYPE.WIRE;
		grid[y][x].connections[from] = 1;

		let doit = Math.floor(Math.random() * 4) + 2;
		for (let i = 0; i < doit; i++)
		{
			let col, count = 0;
			do {
				col = Math.floor(Math.random() * 4);
				count++;
				if (count > 5) {
					if (this.countConnections(x,y) === 1)
						this.makeLight(x,y,from);
					return 1;
				}
			} while (grid[y][x].connections[col] === 1);

			let ret;

			switch (col) {
				case 0:
					ret = this.placeLight(x,y-1,(col+2)%4);
					break;
				case 1:
					ret = this.placeLight(x+1,y,(col+2)%4);
					break;
				case 2:
					ret = this.placeLight(x,y+1,(col+2)%4);
					break;
				case 3:
					ret = this.placeLight(x-1,y,(col+2)%4);
					break;
			}

			if (ret === 0) //light
			{
				if (this.countConnections(x,y) === 1)
					this.makeLight(x,y,from);
				return 1;
			}

			grid[y][x].connections[col] = 1;
		}
		return 1;
	}

	setBatteryAndLights(numLights = 6)
	{
    const {numx} = this.state;
    const {numy} = this.state;
    let {grid} = this.state;
		let x = Math.floor(Math.random() * numx);
		let y = Math.floor(Math.random() * numy);
    grid[y][x].tile = TILE_TYPE.POWER;
    this.batx = x;
    this.baty = y;

		for (let i = 0; i < numLights; i++)
		{
			let col = Math.floor(Math.random() * 4);

			let ret = 0;
			switch (col) {
				case 0:
					ret = this.placeLight(x,y-1,(col+2)%4);
					break;
				case 1:
					ret = this.placeLight(x+1,y,(col+2)%4);
					break;
				case 2:
					ret = this.placeLight(x,y+1,(col+2)%4);
					break;
				case 3:
					ret = this.placeLight(x-1,y,(col+2)%4);
					break;
			}

			if (ret)
				grid[y][x].connections[col] = 1;
		}
	}

  setupGrid() {
    let x,y;
    const {numx} = this.state;
    const {numy} = this.state;
    let {grid} = this.state;
    let t = {
      tile: TILE_TYPE.EMPTY,
      checked: 0,
      connections: [0,0,0,0],
      lit: false
    }
		for (y = 0; y < numy; y++)
		{
			grid.push([]);
			for (x = 0; x < numx; x++)
			{
        let tile = Object.assign({},t);
        tile.connections = [0,0,0,0];
        tile.x = x;
        tile.y = y;
				grid[y].push(tile);
			}
		}

		this.setBatteryAndLights();

		let lightcount = 0;
    grid.forEach(row => {
      row.forEach(t => {
        lightcount += (t.tile === TILE_TYPE.LIGHT) ? 1 : 0;
        if (t.tile !== TILE_TYPE.EMPTY)
				{
          let num = Math.floor(Math.random() * 4);
					for (let i = 0; i < num; i++)
						this.rotateTile(t.x,t.y,false);
        } else {
          let num = Math.floor(Math.random() * EMPTY_STYLES.length);
          t.style = EMPTY_STYLES[num];
        }
      });
    });

    this.rotateTile(this.batx, this.baty, true);

		return lightcount;
  }

  checkPower(x,y,from) {
    const {numx} = this.state;
    const {numy} = this.state;
    let {grid} = this.state;
		if (x < 0 || y < 0 || x >= numx || y >= numy)
			return;
    let tile = grid[y][x];
		if (tile.tile === TILE_TYPE.EMPTY || tile.lit)
			return;
		if (from >= 0 && tile.connections[from] === 0)
			return;
    tile.lit = true;
    this.litCount += (tile.tile === TILE_TYPE.LIGHT) ? 1 : 0;
		if (tile.connections[0] && from !== 0) {
      this.checkPower(x,y-1,2);
    }
		if (tile.connections[1] && from !== 1) {
      this.checkPower(x+1,y,3);
    }
		if (tile.connections[2] && from !== 2) {
      this.checkPower(x,y+1,0);
    }
		if (tile.connections[3] && from !== 3) {
      this.checkPower(x-1,y,1);
    }
  }
  
  rotateTile(x,y,docheckpower) {
    let {grid} = this.state;
		//console.debug('rotate: '+x+','+y);
		if (grid[y][x].tile !== TILE_TYPE.EMPTY) {
			let temp = grid[y][x].connections[3];
			grid[y][x].connections[3] = grid[y][x].connections[2];
			grid[y][x].connections[2] = grid[y][x].connections[1];
			grid[y][x].connections[1] = grid[y][x].connections[0];
			grid[y][x].connections[0] = temp;
			if (docheckpower) {
        grid.forEach(row => {
          row.forEach(t => {t.lit = (t.type === TILE_TYPE.POWER)});
        });
        this.litCount = 0;
        this.checkPower(this.batx, this.baty, -1);
        if (this.state.lightCount) {
          this.forceUpdate();
        }
				if (this.litCount === this.state.lightCount) {
          clearInterval(this.interval);
				}
			}
    }
  }

  update() {
    let difference = this.state.deadline.diff(moment(),'seconds');
    if (difference <= 0) {
      clearInterval(this.interval);
      difference = 0;
    }
    this.setState({
      minutes: Math.floor(difference / 60),
      seconds: difference % 60
    });
  }

  makeGrid() {
    let gridDisplay = [];
    let {grid} = this.state;
    grid.forEach((row, idx) => gridDisplay.push(this.makeRow(row, idx)));
    return (
      <div className="grid">
        {gridDisplay}
      </div>
    );
  }

  makeRow(rowData, idx) {
    let tiles = [];
    rowData.forEach((t, col) => {
      switch (t.tile) {
        case TILE_TYPE.POWER:
          tiles.push(<PowerTile key={col} connections={t.connections} onRotate={() => this.rotateTile(t.x,t.y,true)}/>);
          break;
        case TILE_TYPE.WIRE: 
          tiles.push(<WireTile key={col} connections={t.connections} lit={t.lit} onRotate={() => this.rotateTile(t.x,t.y,true)}/>);
          break;
        case TILE_TYPE.LIGHT: 
          tiles.push(<LightTile key={col} connections={t.connections} color={t.color} lit={t.lit} onRotate={() => this.rotateTile(t.x,t.y,true)}/>);
          break;
        default:
        case TILE_TYPE.BLOCK:
        case TILE_TYPE.EMPTY:
          tiles.push(<Tile key={col} pic={t.style} />);
          break;
        };
      });
    return (
      <div className="blockRow" key={idx}>
        {tiles}
      </div>
    );
  }

  render() {
    let grid = this.makeGrid();
    return (
      <div className="App">
        <div className="countdown">
          {`${("00" + this.state.minutes).slice(-2)}:${("00" + this.state.seconds).slice(-2)} Remaining`}
        </div>
        {grid}
      </div>
    );
  }
}

export default Puzzle;

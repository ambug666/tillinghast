import React, { Component } from 'react';
import './Tile.css';

//up, right, down, left
const CONNECTIONS = {
  '0000': {x: 0, y: 0},  //this should not be
  '1000': {x: 0, y: 0},
  '0100': {x: 1, y: 0},
  '0010': {x: 2, y: 0},
  '0001': {x: 3, y: 0},
  '1100': {x: 0, y: 1},
  '0110': {x: 1, y: 1},
  '0011': {x: 2, y: 1},
  '1001': {x: 3, y: 1},
  '1010': {x: 0, y: 2},
  '0101': {x: 1, y: 2},
  '1110': {x: 0, y: 3},
  '0111': {x: 1, y: 3},
  '1011': {x: 2, y: 3},
  '1101': {x: 3, y: 3},
  '1111': {x: 0, y: 4},
}

const LIGHTS = {
  '0000': 0,  //this should not be
  '1000': 0,
  '0100': 1,
  '0010': 2,
  '0001': 3,
}

class PowerTile extends Component {

  render() {
    let connections = this.props.connections || [1, 0, 0, 0];
    let dir = CONNECTIONS[connections.join('')];
    return (
      <div style={{"backgroundPosition": `-${dir.x*100}px -${dir.y*100}px`}} className={`Tile Power`} onClick={() => this.props.onRotate()} />
    );
  }
}

class WireTile extends Component {
  render() {
    let connections = this.props.connections || [1, 0, 0, 0];
    let dir = CONNECTIONS[connections.join('')];
    let lit = this.props.lit ? 'WireLit' : 'WireDark';
    return (
      <div style={{"backgroundPosition": `-${dir.x*100}px -${dir.y*100}px`}} className={`Tile ${lit}`} onClick={() => this.props.onRotate()} />
    );
  }
}

class LightTile extends Component {

  render() {
    let color = this.props.color || 'White';
    let lit = this.props.lit ? 1 : 0;
    let connections = this.props.connections || [1, 0, 0, 0];
    let dir = LIGHTS[connections.join('')];
    return (
      <div style={{"backgroundPosition": `-${dir*100}px -${lit*100}px`}} className={`Tile ${color}Light`} onClick={() => this.props.onRotate()}/>
    );
  }
}

class Tile extends Component {

  render() {
      let pic = this.props.pic || 'Empty';
    return (
      <div className={`Tile ${pic}`} />
    );
  }
}

export { Tile, LightTile, PowerTile, WireTile };


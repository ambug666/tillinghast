/*eslint default-case:0 accessible-emoji:0*/
import React, { Component } from 'react';
import Admin from './Admin';
import Puzzle from './Puzzle';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      admin: (this.getParameter('admin') !== null),
      minutes: 10,
      numx: 15,
      numy: 8,
      tolerance: 15
    };
  }

  
  getParameter(id) {
    id = id.toLowerCase();
    let ret = null;
    let url = window.location.href.substring(window.location.href.indexOf('?') + 1);
    let parameters = url.split('&');
      parameters.forEach((param) => {
        let t = param.split('=');
        if (t[0].toLowerCase() === id) {
          ret = t[1];
        }
    });
    return ret;
  }

  startGrid() {
    this.setState({admin: false});
  }

  render() {
    const {admin} = this.state;
    const {minutes} = this.state;
    const {numx} = this.state;
    const {numy} = this.state;
    const {tolerance} = this.state;
    if (admin) {
      return <Admin minutes={minutes} numx={numx} numy={numy} tolerance={Math.floor(tolerance)} start={() => this.startGrid()} parent={this}/>
    } else {
      return <Puzzle minutes={minutes} numx={numx} numy={numy} tolerance={Math.floor(numx*numy*tolerance/100)}/>
    }
  }
}

export default App;

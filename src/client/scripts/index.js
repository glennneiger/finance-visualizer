import '../styles/index.scss';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { NavBar } from "./navbar/navbar"

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app-base")); 
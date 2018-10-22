import "../../styles/navbar.scss"
import React from 'react';

export class NavBar extends React.Component{
  
  constructor(){
    super();
  }

  render(props) {
    return (
      <nav id="navbar-nav" className="container-fluid navbar navbar-dark  main-navbar">
        <div className="row">
          <div class="col-lg-10 vert-align">
            <div className="inline">
                <span className="navbar-title">&lt;Insert Cool Title Here&gt;</span>
            </div>
            <div class="inline navbar-left-container-wrapper">
              <ul id="navbar-left-container"> 
                <li className="navbar-item navbar-text">refresh</li>
                <li className="navbar-item navbar-text">date range</li>
                <li className="navbar-item navbar-text">categorize</li>
                <li className="navbar-item navbar-text">prediction</li>
              </ul>
            </div>
          </div>
          <div class="col-lg-2">
            <div class="navbar-right-container">
              <span class="navbar-text navbar-status-option navbar-status-option-left navbar-status-option-active">offline</span>
              <span class="navbar-text navbar-status-option navbar-status-option-right navbar-status-option-inactive">online</span>
            </div>
          </div>
        </div>
      </nav>
    );
  };
}
import React from 'react';

export default (props) => {
  let sliderClass = props.online ? "navbar-slider-on" : "navbar-slider-off";
  return (
    <div className="inline">
      <div id="navbar-status-container" onClick={() => props.setIsOnline(!props.online)} className="navbar-status-container">
        <div id="navbar-slider-wrapper" className="navbar-slider-wrapper">
          <div className={sliderClass}></div>
        </div>
        <span className="navbar-text navbar-status-option navbar-status-option-left">offline</span>
        <span className="navbar-text navbar-status-option navbar-status-option-right">online</span>
      </div>
    </div>
  );
}
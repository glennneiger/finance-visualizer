import React from 'react';

export default (props) => {
  let sliderClass = props.online ? "navbar-slider-on" : "navbar-slider-off";
  return (
    <div className="col-lg-2 d-none d-lg-block">
      <div onClick={() => props.setIsOnline(!props.online)} className="navbar-right-container">
        <div className="navbar-slider-wrapper">
          <div className={sliderClass}></div>
        </div>
        <span className="navbar-text navbar-status-option navbar-status-option-left">offline</span>
        <span className="navbar-text navbar-status-option navbar-status-option-right">online</span>
      </div>
    </div>
  );
}
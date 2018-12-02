import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

var global_showLogging = true;
var global_showDebug = true;
var global_showError = true;

ReactDOM.render(<App resizeBarWidth={0.2}/>, document.getElementById("app-base")); 

if(!global_showLogging){
  console.log = ()=>{};
}
if(!global_showDebug){
  console.debug = ()=>{};
}
if(!global_showError){
  console.error = ()=>{};
}
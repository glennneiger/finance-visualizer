import React from "react";
import '../../styles/utility.scss';

export default (props)=>{
  return <div className="resize-bar" onMouseDown={props.startResize} style={{width: props.width+"%"}}></div>
}
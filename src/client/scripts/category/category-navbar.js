import React from "react";
import "../../styles/overall-perspective.scss"
import { FaChartPie, FaChartLine, FaChartBar} from "react-icons/fa";
import { IconContext } from "react-icons";

export default function(props){
  let overallContainerClass = props.opened ? "perspective-navbar-container" : "perspective-navbar-container-closed";
  let navItemClass = "perspective-navbar-item " + (props.opened ? "perspective-navbar-visible" : "perspective-navbar-invisible");
  let openedHamburgerClass = props.opened ? "perspective-navbar-hamburger-container-opened" : "";
  let navbarTitleClass = props.opened ? "perspective-navbar-title perspective-navbar-visible" : "perspective-navbar-title perspective-navbar-invisible";
  return(
    <div className={overallContainerClass}>
      <div onClick={props.toggleDisplay} className={"perspective-navbar-hamburger-container "+openedHamburgerClass}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={navbarTitleClass}>
        <span>{props.title + " Cost"} </span>
      </div>
      <div>
        <div id="perspective-navbar-pie-container" className="perspective-navbar-item-container">
          <span>
              <IconContext.Provider value={{size:"2rem"}}>
                <FaChartPie className="perspective-navbar-icon"/>
              </IconContext.Provider>
          </span>
          <span className={navItemClass}>Pie Chart</span>
        </div>
        <div id="perspective-navbar-line-container" className="perspective-navbar-item-container">
          <span>
            <IconContext.Provider value={{size:"2rem"}}>
              <FaChartLine className="perspective-navbar-icon"/>
            </IconContext.Provider>
          </span>
          <span className={navItemClass}>Time Line</span>
        </div>
        <div id="perspective-navbar-bar-container" className="perspective-navbar-item-container">
          <span>
            <IconContext.Provider value={{size:"2rem"}}>
              <FaChartBar className="perspective-navbar-icon"/>
            </IconContext.Provider>
          </span>
          <span className={navItemClass}>Bar Graph</span>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import "../../styles/overall-perspective.scss"
import { FaChartPie, FaChartLine, FaChartBar} from "react-icons/fa";
import { IconContext } from "react-icons";

export default function(props){
  let overallContainerClass = props.opened ? "perspective-navbar-container" : "perspective-navbar-container-closed";
  let navItemClass = "perspective-navbar-item " + (props.opened ? "perspective-navbar-visible" : "perspective-navbar-invisible");
  let openedHamburgerClass = props.opened ? "perspective-navbar-hamburger-container-opened" : "";
  let navbarTitleClass = "perspective-navbar-title " + (props.opened ? "perspective-navbar-visible" : "perspective-navbar-invisible");
  return(
    <div style={{alignItems: "stretch", paddingLeft:"15px"}} className={"d-md-flex"}>
      <div className={overallContainerClass + " d-none d-md-block"}>
        <div onClick={props.toggleDisplay} className={"perspective-navbar-hamburger-container "+openedHamburgerClass}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={navbarTitleClass}>
          <span>{props.title}</span>
        </div>
        <div >
          <div className="perspective-navbar-item-container">
            <span>
                <IconContext.Provider value={{size:"2rem"}}>
                  <FaChartPie className="perspective-navbar-icon"/>
                </IconContext.Provider>
            </span>
            <span className={navItemClass}>Pie Chart</span>
          </div>
          <div className="perspective-navbar-item-container">
            <span>
              <IconContext.Provider value={{size:"2rem"}}>
                <FaChartLine className="perspective-navbar-icon"/>
              </IconContext.Provider>
            </span>
            <span className={navItemClass}>Time Line</span>
          </div>
          <div className="perspective-navbar-item-container">
            <span>
              <IconContext.Provider value={{size:"2rem"}}>
                <FaChartBar className="perspective-navbar-icon"/>
              </IconContext.Provider>
            </span>
            <span className={navItemClass}>Bar Graph</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BottomPerspectiveNavbar(props){
  return (
    <div style={{width:"100%", textAlign:"center"}} className={props.className}>
      <div className="perspective-bottom-navbar">
        <div className="perspective-navbar-item-container">
          <span>
              <IconContext.Provider value={{size:"3rem"}}>
                <FaChartPie className="perspective-navbar-icon"/>
              </IconContext.Provider>
          </span>
        </div>
        <div className="perspective-navbar-item-container">
          <span>
            <IconContext.Provider value={{size:"3rem"}}>
              <FaChartLine className="perspective-navbar-icon"/>
            </IconContext.Provider>
          </span>
        </div>
        <div className="perspective-navbar-item-container">
          <span>
            <IconContext.Provider value={{size:"3rem"}}>
              <FaChartBar className="perspective-navbar-icon"/>
            </IconContext.Provider>
          </span>
        </div>
      </div>
    </div>
  );

}
import '../styles/index.scss';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { NavBar } from "./navbar/navbar"

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {online:false, startDate:moment().startOf('day'), endDate:moment().startOf('day')};
  }

  setIsOnline = (isOnline) => {
    this.setState(()=>({online:isOnline}));
  }

  setDateRange = (startDate, endDate) => {
    this.setState(()=>{
      return {
        startDate:startDate,
        endDate:endDate
      }
    });
  }

  render() {
    return (
      <div>
        <NavBar setIsOnline={this.setIsOnline} online={this.state.online} startDate={this.state.startDate} endDate={this.state.endDate} setDateRange={this.setDateRange}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app-base")); 
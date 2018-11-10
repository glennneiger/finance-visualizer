import React from "react";

/**
 * This test class is necessary because the actual react-datepicker cannot be loaded by react-test-renderer. However this is okay because
 * it's not our component, so we don't need to component or unit test it.
 */
export default class DatePicker extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return (<div></div>);
  }
} 
import React, { Component } from 'react';
import './TaskPanel.css';

export default class LoginTask extends React.Component {
  constructor(props) { super(props); this.state = { }; }

  render() {
    if (this.props.usrEmail == "")
       return(<div> </div>)
  }

}

LoginTask.propTypes = {
    /* TODO: Review ProTypes */
}

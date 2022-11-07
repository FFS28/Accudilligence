// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
//import { Switch, Route } from 'react-router-dom';
//import { AppBar, Tab } from '@material-ui/core';
//import Typography from '@material-ui/core/Typography';
//import Box from '@material-ui/core/Box';
//import Button from '@material-ui/core/Button';
import './ClientTask.css';
import TargetHome from './TargetHome'


//function TabPanel(props) {
// const { children, value, index, ...other } = props;
//
//  return (
//    <div
//      role="tabpanel"
//      hidden={value !== index}
//      id={`simple-tabpanel-${index}`}
//      aria-labelledby={`simple-tab-${index}`}
//      {...other}
//    >
//      {value === index && (
//        <Box p={3}>
//          <Typography>{children}</Typography>
//        </Box>
//     )}
//    </div>
//  );
//}

export default class TargetTask extends React.Component {
  constructor(props) { 
    super(props); 
    this.handleChangeTarget = this.handleChangeTarget.bind(this);
    this.state = { data: {} };
  }

  componentDidMount()
  {
    document.body.style.backgroundColor = "#f8fff8"
  }

  componentWillUnmount(){
    document.body.style.backgroundColor = "#000"
  }

  handleChangeTarget = event => { };

  render() {
    return(
      (this.props.TargetID ?
          <TargetHome  usrEmail={this.props.usrEmail} TargetID={this.props.TargetID} TargetStatus={this.props.targetStatus} jwt={this.props.jwt} />
        :
          <div>&nbsp;</div>
      )
    );
  }
}

TargetTask.propTypes = {
    /* TODO: Review ProTypes */
}

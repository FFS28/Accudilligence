import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddCircle from '@material-ui/icons/AddCircle';
import './SubToolBar.css';

export default class SubToolBar extends Component {
  constructor(props) { 
    super(props);
    this.state = { }; 
    this.createProjectDialog = this.createProjectDialog.bind(this);
  }

  createProjectDialog() {
    // Modal dialog box for creating new project
  }

  render() {
    return (
      <div className="fixedheader" id="fixedHeaderNav">
        <div className="RightTopNav">
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<Icon>AddCircle</Icon>}
          >
            New Project
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            startIcon={<Icon>email</Icon>}
          >
            Support
          </Button>
        </div>
      </div>
    )
  }
}







TopNavPanel.propTypes = {
    /* TODO: Review ProTypes */
}
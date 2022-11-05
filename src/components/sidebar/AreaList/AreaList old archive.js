import React from "react";
import Select from "react-select";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import PropTypes from "prop-types";
import axios from 'axios';

import TopicList from "../TopicList";
import AreaDialog from '../ActivateDialog';
import WarningDialog from '../AlertDialog';
import { cancelDialog, cancelWarningDialog, activateArea } from '../../../store/modules/dialogRedux';
import { loadQuestionPanel } from '../../../store/modules/questionRedux';
import { Auth, API } from 'aws-amplify';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 'auto',
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto",
    background: '#353535'
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    color: "#fff",
    paddingLeft: 15
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  areaValue: {
    fontSize: 16
  },
  placeholderEmpty: {
    position: "absolute",
    left: 15,
    bottom: -25,
    fontSize: 18,
    color: '#fff',
    '&:before': {
      display: 'flex',
      content: "''",
    },
  },
  placeholder: {
    position: "absolute",
    left: 15,
    bottom: -25,
    fontSize: 18,
    color: '#fff',
    '&:before': {
      display: 'flex',
      content: "'Please select a Area'",
    },
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(0)
  }
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool
};

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

Placeholder.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function AreaValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.areaValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

AreaValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired
};

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  AreaValue,
  ValueContainer
};

function AreaList(props) {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };
  
  const {resAreaList, selectedProject, onChangeProject} = props;

  const [areaList, setAreaList] = useState([]);
  
  useEffect(() => {
    if (resAreaList) {
      setAreaList(resAreaList);
    }
    //console.log("In useEffect:" + JSON.stringify(resAreaList));
  }, [resAreaList]);
  
  const [projectID, setProjectID] = useState('');
  const [areaID, setAreaID] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [selectedProjectLabel, setSelectedProjectLabel] = useState('');
  const [changeProject, setChangeProject] = useState(false);
  const [loading, setLoading] = useState(false); // change event status for get areaList

  const dialogText = 'Please have the following evidence available when starting this Area:- Evidence list, list item, item,…';
  const activateUrl = 'https://ivzfc9tnx8.execute-api.us-east-2.amazonaws.com/Dev';

  let userID = Auth.userPool.getCurrentUser().username;
  function getAreaTopics(pid, aid)
  {
    if (userID) {
        let payLoad = {
          body: {
            targetUsr: userID,
            projectID: pid,
            AID: aid
          }
        }
        setLoading(true);
        setChangeProject(false);
        API.post('', '/', payLoad ).then(response => {
            // console.log('topicList : ' + res.data);
            if (response.statusCode === 200) {
              setTopicList(response.body);
            }
            setLoading(false);
        }).catch(error => {
          console.log("API Error: GetProjectAreas", error);
        });
    }
  }

  const handleChangeArea = async e => {
    //console.log(e);
    if( e !== undefined) {
      setProjectID(e.projectID);
      setAreaID(e.areaID);
      dispatch(loadQuestionPanel(true));
      if(e.status === "New") {
        setOpenDialog(true);
      } else {
        getAreaTopics(e.projectID, e.areaID)
      }
    }
  }

  //--- get selectedProject from project redux ---//
  useEffect(() => {
    setChangeProject(onChangeProject); // get projectChangeEvent
    handleChangeArea(); // areaList change event

    if (selectedProject !== selectedProjectLabel) {
      setLoading(true);
      setSelectedProjectLabel(selectedProject);
    }
  }, [onChangeProject, selectedProject, selectedProjectLabel]);

  /** 
   * |---------- submit/cancel event from dialog redux -------------|
   **/
  const cancelToggle = useSelector(state => state.dialogRedux.openDialog);
  const cancelWarningToggle = useSelector(state => state.dialogRedux.openWarningDialog);
  const resActivateCode = useSelector(state => state.dialogRedux.statusAreaCode);
  const errorActivate = useSelector(state => state.dialogRedux.errorAreaActivate);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if(cancelToggle !== null) {
      setOpenDialog(false);
      dispatch(cancelDialog(null));
    }
    if(cancelWarningToggle !== null && openWarningDialog) {
      setOpenWarningDialog(false);
      console.log("cancelWarningToggle : " + openWarningDialog);
      dispatch(cancelWarningDialog(null));
    }
    if(resActivateCode !== 0) {
      setOpenDialog(false);
      if(resActivateCode === 200) {
        //console.log('success area activate');
        // set new to act in selected Project
        for (let i = 0 ; i < areaList.length; i++) {
          if (areaList[i].AID === areaID) {
            areaList[i].Status = 'Act';
            // console.log(projectList);
          }
        }

        // get topic list
        //getSelecteTopicList(projectID, areaID);
        getAreaTopics(projectID, areaID);
      }
      else if(resActivateCode === 403 || resActivateCode === 405) {
        console.log('denied activate');
        setOpenWarningDialog(true);
        dispatch(cancelWarningDialog(null));
      }
      dispatch(activateArea(0, null));
    }
    // if(errorActivate !== null) {
    //   setOpenDialog(false);
    //   setOpenWarningDialog(true);
    // }
  }, [cancelToggle, resActivateCode, errorActivate, cancelWarningToggle, openWarningDialog, dispatch, projectID, areaID, areaList]);

  //console.log("changeArea : " + JSON.stringify(areaList));
  return (
    <div className={classes.root}>
      <NoSsr>
        {!changeProject ?
          <Select
            classes={classes}
            styles={selectStyles}
            inputId="select-area"
            TextFieldProps={{
              label: "",
              InputLabelProps: {
                htmlFor: "select-area",
                shrink: true
              },
              placeholder: "area"
            }}
            options={
              areaList.map(area => ({
                areaID: area.AID,
                label: area.AreaNameLStr,
                projectID: area.ProjectID,
                status: area.Status
              }))
            }
            components={components}
            onChange={handleChangeArea}
          /> :
          <Select
            classes={classes}
            styles={selectStyles}
            inputId="select-area"
            TextFieldProps={{
              label: "",
              InputLabelProps: {
                htmlFor: "select-area",
                shrink: true
              },
              placeholder: "area"
            }}
            options={
              areaList.map(area => ({
                areaID: area.AID,
                label: area.AreaNameLStr,
                projectID: area.ProjectID,
                status: area.Status
              }))
            }
            components={components}
            value=''
            onChange={handleChangeArea}
          />
          }    
        <div className={classes.divider} />
        <TopicList resTopicList={topicList} loadingArea={loading}></TopicList>
      </NoSsr>
      <AreaDialog type="area" dialogText={dialogText} openDialog={openDialog} activateUrl={activateUrl} projectID={projectID} areaID={areaID}></AreaDialog>
      <WarningDialog type='Warning' selector='area' openWarningDialog={openWarningDialog}></WarningDialog>
    </div>
  );
}

export default AreaList;

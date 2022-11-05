import React from 'react';
import Select from 'react-select';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import axios from 'axios';

import AreaList from '../AreaList/AreaList';
import ProjectDialog from '../ActivateDialog';
import WarningDialog from '../AlertDialog';
import { cancelDialog, cancelWarningDialog, activateProject } from '../../../store/modules/dialogRedux';
import { loadQuestionPanel } from '../../../store/modules/questionRedux';
import './ProjectList.css';
import { Auth, API } from 'aws-amplify';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 'auto',
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
    background: '#353535',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    color: '#fff',
    paddingLeft: 5
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  projectValue: {
    fontSize: 20,
    color: "#fff"
  },
  placeholder: {
    position: 'absolute',
    left: 5,
    bottom: -25,
    fontSize: 18,
    color: '#fff'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: 1,
  },
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
  selectProps: PropTypes.object.isRequired,
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
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
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired,
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
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
  isSelected: PropTypes.bool,
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
  selectProps: PropTypes.object.isRequired,
};

function ProjectValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.projectValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

ProjectValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
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
  selectProps: PropTypes.object.isRequired,
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
  selectProps: PropTypes.object,
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  ProjectValue,
  ValueContainer,
};

function ProjectList(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const {projectList, onGetSelectedProject} = props;

  // projectItem in dropdown selection
  const [openDialog, setOpenDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [projectID, setProjectID] = useState('');
  const [areaList, setAreaList] = useState([]);
  const [changeEvent, setChangeEvent] = useState(false); // change event status for get areaList

  const dialogText = 'By opening this Project, I understand legally that I am bound to truthful representation of all provided Evidence by myself or anyone I designate to respond…….';
  const activateUrl = 'https://e3i2vbfb25.execute-api.us-east-2.amazonaws.com/Dev';

  let userID = Auth.userPool.getCurrentUser().username;

  function getProjectAreas(projID)
  {
    if (userID) {
        let payLoad = {
          body: {
            projectID: projID
          }
        }

        API.post('gettargetprojectareas', '/', payLoad ).then(response => {
          //console.log("Fetched areas:"+JSON.stringify(response));
          if (response.statusCode === 200) {
            setAreaList(response.body);
            //setAreaList(response.data.body);
        }
        }).catch(error => {
          console.log("API Error: GetProjectAreas", error);
        });
    }
  }



  function handleChangeProjectSelection(e) {
    console.log(e);
    setProjectID(e.projectID);
    // -- project redux -- //
    onGetSelectedProject(e.projectID);
    dispatch(loadQuestionPanel(true));

    if(e.status === "New") {
      setOpenDialog(true);
    }
    else {
      setChangeEvent(true);
      getProjectAreas(e.projectID);
    }
  }

  // ---------- submit/cancel event from dialog redux -------------//
  const cancelToggle = useSelector(state => state.dialogRedux.openDialog);
  const cancelWarningToggle = useSelector(state => state.dialogRedux.openWarningDialog);
  const resActivateCode = useSelector(state => state.dialogRedux.statusProjectCode);
  const errorActivate = useSelector(state => state.dialogRedux.errorProjectActivate);

  //const onCloseDialog = () => dispatch(cancelDialog(false));

  useEffect(() => {
    if(cancelToggle !== null) {
      setOpenDialog(false);
      dispatch(cancelDialog(null));
    }
    if(cancelWarningToggle !== null) {
      setOpenWarningDialog(cancelWarningToggle);
      dispatch(cancelWarningDialog(null));
    }
    if(resActivateCode !== 0) {
      setOpenDialog(false);
      dispatch(cancelDialog(null));
      if(resActivateCode === 200) {
        console.log('success project activate');

        // set new to act in selected Project
        for (let i = 0 ; i < projectList.length; i++) {
          if (projectList[i].ProjectID === projectID) {
            projectList[i].Status = 'Act';
            // console.log(projectList);
          }
        }
        // get AreaList
        getProjectAreas(projectID);
      }
      else if(resActivateCode === 403 || resActivateCode === 405) {
        console.log('denied project activate');
        setOpenWarningDialog(true);
        dispatch(cancelWarningDialog(null));
      }
      dispatch(activateProject(0, null));
    }
    // if(errorActivate !== null || errorActivate !== undefined) {
    //   console.log('errorActivate : ' + errorActivate);
    //   setOpenDialog(false);
    //   setOpenWarningDialog(true);
    //   dispatch(activateProject(null, null));
    // }
  }, [cancelToggle, resActivateCode, errorActivate, cancelWarningToggle, dispatch, projectID, projectList]);
  
  return (
    <div className={classes.root}>
      <NoSsr>
        <div className={classes.divider} />
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="select-project"
          defaultValue='none'
          TextFieldProps={{
            label: '',
            InputLabelProps: {
              htmlFor: 'select-project',
              shrink: true,
            },
            placeholder: 'select-project',
          }}
          options={
            projectList ? 
              projectList.map((project) => ({
                projectID: project.ProjectID,
                label: 'Project ' + project.ProjectName,
                status: project.Status,
              })) : []
          }
          components={components}
          onChange={handleChangeProjectSelection}
        />
      </NoSsr>
      <AreaList resAreaList={areaList} selectedProject={projectID} onChangeProject={changeEvent}></AreaList>
      <ProjectDialog type="project" dialogText={dialogText} openDialog={openDialog} projectID={projectID} activateUrl={activateUrl}></ProjectDialog>
      <WarningDialog type='Warning' selector='project' openWarningDialog={openWarningDialog}></WarningDialog>
    </div>
  );
}

export default ProjectList;

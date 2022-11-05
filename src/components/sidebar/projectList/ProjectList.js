// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import AreaList from '../AreaList/AreaList';
import ProjectDialog from '../ActivateDialog';
import WarningDialog from '../AlertDialog';
import { cancelDialog, cancelWarningDialog, activateProject } from '../../../store/modules/dialogRedux';
import { SelectProject, SelectArea } from '../../../store/modules/projectRedux';
import { RerenderingQuestionPanel } from '../../../store/modules/questionRedux';
import { ADCache, AUTO_SELECT } from '../../../store/ADCache';
import './ProjectList.css';
import { Auth, API } from 'aws-amplify';

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

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
    zIndex: 200,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: 1,
  },
  fillerDiv: {
    width: 'auto',
    height: 35,
    background: '#353535',
    zIndex: 200
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
  const { jwt, setPBV, setPBB, rt, ra, frt, fra } = props;
  const classes = useStyles();
  const theme = useTheme();

  // Project Redux
  const selectedProject = useSelector(state => state.projectRedux.selectedProject);
  const selectedArea    = useSelector(state => state.projectRedux.selectedArea);
  const refreshAreaList = useSelector(state => state.projectRedux.refreshAreaList);
  const dispatch        = useDispatch();

  const [currentSelectedProject, setCurrentSelectedProject] = useState(null);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  // projectItem in dropdown selection
  const [openDialog, setOpenDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  let userID = Auth.userPool.getCurrentUser().username;
  let userJWT = (Auth.user.jwt) ? Auth.user.jwt : jwt;
  let projectList = ADCache.ProjectList;
  
  function getProjectAreasPartTwo(key)
  {
    var areaList = ADCache.AreaList[key];
    // Now need to select the current subTopic which is the current "item". Lot's of logic here if auto or manual or empty
    if (areaList && (areaList.length > 0)) {
      var indexNewlySelectedArea = 0;
      if (ADCache.selectionType === AUTO_SELECT) {
        for (var loopi = 0; loopi < areaList.length; loopi++) {
          var anArea = areaList[loopi];
          if (anArea.AnsweredCount < anArea.TotalCount) {
            //console.log("Auto Select Area: "+loopi);
            indexNewlySelectedArea = loopi
            break;
          }
        }
        
      }
      ADCache.selectedAreaIndex = indexNewlySelectedArea;
      dispatch(SelectArea(areaList[indexNewlySelectedArea].AID));
    }
  }

  function getProjectAreas(projID)
  {
    if (userID) {
      let key = projID;
      if (ADCache.ResetAreas) { // Force reset of areaList mainly by special trigger questions
        ADCache.AreaList       = {};
        ADCache.TopicList      = {};
        ADCache.SubTopicList   = {};
        ADCache.QuestionKey    = {};
        ADCache.ResetAreas     = false;
        ADCache.ResetTopics    = true;
        ADCache.ResetSubTopics = true;
        ADCache.selectTooltip  = true;
      }

      if (! ADCache.AreaList.hasOwnProperty(key)) {
        // Quickly set to debounce additional calls from getting to Post GetAreas
        // Let remainder render logic handle if not "fully" loaded
        ADCache.AreaList[key] = null;

        let payLoad = {
          headers: {
            Authorization: userJWT
          },
          body: {
            projectID: projID
          }
        }
        //console.log("POST GetAreas");
        API.post('getprojectareas', '/', payLoad ).then(response => {
          if (response.statusCode === 200) {
            ADCache.AreaList[key] = response.body;
            setPBV(Math.floor(response.body[0].ProjectAnsweredCount*100/response.body[0].ProjectTotalCount));
            setPBB(Math.floor((response.body[0].ProjectAnsweredCount+response.body[0].ProjectUnderReviewCount)*100/response.body[0].ProjectTotalCount));
            //ADCache.ResetSubTopics = true; // Subtopic now uses Project and Area in keys, no need to refresh
            getProjectAreasPartTwo(key); // Need to call within the promise response
          } else {
            //Handle errors here.
            console.log("Error: Unexpected exception retrieving project areas. Please try again a little bit later.");
          }
        }).catch(error => { 
          if (error.message.includes("401")) {
            window.location.reload(true);
            //signOut();
          } else {
            console.log("Error: Unexpected exception retrieving project areas.")
          }
      });
      } else
        getProjectAreasPartTwo(key);
    }
  }

  function handleReDisplayProjectDialog(e) {
    alert("Please SIGN OUT and sign back in acknowledge the need to activate the project.");
  }

  function handleChangeProjectSelection(e) {
    // -- project redux -- //
    if (e.projectID !== selectedProject) {
      // Need to clear all the caches and start over to make sure there is no overlap
      // Server already has data visibility limitations, the cache is just for performance, not security
      ADCache.AreaList       = {};
      ADCache.TopicList      = {};
      ADCache.SubTopicList   = {};
      ADCache.QuestionKey    = {};
      ADCache.ResetAreas     = false;
      ADCache.ResetTopics    = false;
      ADCache.ResetSubTopics = false;
      ADCache.selectionType  = AUTO_SELECT; // FORCE AUTO SELECT ON NEW PROJECT SELECTION AS ALL CACHES ARE FLUSHED
      dispatch(SelectProject(e.projectID));  
    } 
 
  }

  // ---------- submit/cancel event from dialog redux -------------//
  const cancelToggle = useSelector(state => state.dialogRedux.openDialog);
  const cancelWarningToggle = useSelector(state => state.dialogRedux.openWarningDialog);
  const resActivateCode = useSelector(state => state.dialogRedux.statusProjectCode);
  //const errorActivate = useSelector(state => state.dialogRedux.errorProjectActivate);

  //const onCloseDialog = () => dispatch(cancelDialog(false));

  useEffect(() => {
    // FIRST TIME LOGIN AND IF ONLY 1 PROJECT NEED TO ACTIVATE DIALOG TERMS AND AGREEMENT WILL KICK OFF PROCESSES
    //
    if (ADCache != null) {
      if (ADCache.ProjectList != null) {
        projectList = ADCache.ProjectList[userID]

        try {
          if (projectList.length === 1) {
            if(projectList[0].hasAgreedToTerms === false) {
              // Need to override locally due to delay in dispatch React
              //console.log("still not agreed");
              setCurrentSelectedProject(projectList[0].ProjectID);
              setOpenDialog(true);
              return;
            }
          } else {
            for (let i2 = 0 ; i2 < projectList.length; i2++) {
              if ((projectList[i2].ProjectID === selectedProject) && (projectList[i2].hasAgreedToTerms === false)) {
                setCurrentSelectedProject(projectList[i2].ProjectID);
                setOpenDialog(true);
                return;
              }
            }
          }
        } catch (e) {
          // just ignore
        }
      }

      // console.log("userEffect(ProjectList)...");
      dispatch(RerenderingQuestionPanel(true));
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
          //console.log('success project activate');

          // set new to act in selected Project
          projectList = ADCache.ProjectList[userID]
          for (let i = 0 ; i < projectList.length; i++) {
            if (projectList[i].ProjectID === selectedProject) {
              projectList[i].Status = 'ACT';
              // console.log(projectList);
            }
          }
          // get AreaList
          getProjectAreas(selectedProject);
        }
        else if(resActivateCode === 403 || resActivateCode === 405) {
          console.log('ERROR: Server error activating the project.');
          setOpenWarningDialog(true);
          dispatch(cancelWarningDialog(null));
        }
        dispatch(activateProject(0, null));
      }
      if (selectedProject || refreshAreaList) {
        getProjectAreas(selectedProject)
      }
    }
  }, [cancelToggle, resActivateCode, cancelWarningToggle, selectedProject, refreshAreaList]);

  //if (ADCache.ProjectList[key].length === 1) {
  //let aProj = ADCache.ProjectList[key][0];
  //if (aProj["Status"] === "ACT") {
  //  ADCache.selectionType = AUTO_SELECT;
  //  dispatch(SelectProject(aProj["ProjectID"]));
  //}

  // console.log("Render projectList");
  projectList = ADCache.ProjectList[userID]
  return (
    <div className={classes.root}>
      {projectList != null ? 
        (projectList.length === 1)
          ? 
            <div className="greyFill">
              {projectList[0].hasAgreedToTerms 
                ?
                  <span>Project {projectList[0].ProjectName}</span>
                :
                  <span onClick={handleReDisplayProjectDialog}>Click to Activate Project</span>
              }
            </div>
          :
            <NoSsr>
              <Select
                classes={classes}
                styles={selectStyles}
                inputProps={{ id: 'projects' }}
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
                      activationDT: project.ActivationDT,
                      reqDeliveryDT: project.RequestDeliveryDT,
                      hasAgreedToTerms: project.hasAgreedToTerms,
                      isOwner: project.isOwner,
                    })) : []
                }
                components={components}
                onChange={handleChangeProjectSelection}
              />
            </NoSsr>
        : ''}
      { selectedArea ? 
          <AreaList jwt={jwt} setPBV={setPBV} setPBB={setPBB} rt={rt} ra={ra} frt={frt} fra={fra} ></AreaList>
        :
          <div className={classes.fillerDiv}>&nbsp;</div>
      }
      <ProjectDialog type="project" openDialog={openDialog} projectID={currentSelectedProject} jwt={jwt}></ProjectDialog>
      <WarningDialog type='Warning' selector='project' openWarningDialog={openWarningDialog}></WarningDialog>
    </div>
  );
}

export  default ProjectList;

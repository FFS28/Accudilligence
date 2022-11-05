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
import "./AreaList.css";
import TopicList from "../TopicList";
import { ADCache, AUTO_SELECT, MANUAL_SELECT } from '../../../store/ADCache';
import { SelectArea, SelectTopic } from '../../../store/modules/projectRedux';
import { RerenderingQuestionPanel } from '../../../store/modules/questionRedux';
import { Auth, API } from 'aws-amplify';
import { zIndex } from "material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 'auto',
    color: '#353535',
    zIndex: 100
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
    color: "#333",
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
    fontSize: 16,
    color: "#333"
  },
  placeholderEmpty: {
    position: "absolute",
    left: 15,
    bottom: 25,
    fontSize: 17,
    color: '#333',
    '&:before': {
      display: 'flex',
      content: "' '",
    },
  },
  placeholder: {
    position: "absolute",
    left: 15,
    bottom: -25,
    fontSize: 17,
    color: '#333',
    '&:before': {
      display: 'flex',
      content: "' '",
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
      className="areaplaceholderEmpty"
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
  const { jwt, setPBV, setPBB, rt, ra, frt, fra } = props;
  const classes = useStyles();
  const theme = useTheme();

  // Project Redux
  const selectedProject = useSelector(state => state.projectRedux.selectedProject);
  const selectedArea    = useSelector(state => state.projectRedux.selectedArea);
  const selectedTopic   = useSelector(state => state.projectRedux.selectedTopic);
  const refreshTopicList= useSelector(state => state.projectRedux.refreshTopicList);
  const dispatch        = useDispatch();

  const [topicsLoaded, setTopicsLoaded] = useState(false); // local state trigger for first render

  var userID    = Auth.userPool.getCurrentUser().username;
  var userJWT   = (Auth.user.jwt) ? Auth.user.jwt : jwt;
  var areaList  = ADCache.AreaList[selectedProject];
  var topicList = ADCache.TopicList[selectedProject + "." + selectedArea];

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      },
      backgroundColor: '#d6d6d6',
      zIndex: 100
    })
  };
  
  function getAreaTopicsPartTwo(key)
  {
    if (! topicList)
      return;
    if (ADCache.selectionType === AUTO_SELECT) {
      console.log("in select auto");
      if (topicList.length > 0) {
        var loopi;
        var found = false;
        for (loopi = 0; loopi < topicList.length; loopi++) {
          var aTopic = topicList[loopi];
          if (aTopic.AnsweredCount < aTopic.TotalCount) {
              found = true;
              dispatch(SelectTopic(aTopic.TID));
              console.log("found is true");
              break;
          }
        }
        if (!found) {
          dispatch(SelectTopic(topicList[topicList.length-1].TID));
          console.log("found is false");
        }
      }
    }
    setTopicsLoaded(Date.now());
  }

  function getAreaTopics(pid, aid)
  {
      if (userID) {
        let key = pid + "." + aid;
        if (ADCache.ResetTopics) { // Force reset of areaList mainly by special trigger questions
          ADCache.TopicList      = {};
          ADCache.SubTopicList   = {};
          ADCache.QuestionKey    = {};
          ADCache.ResetTopics    = false;
          ADCache.ResetSubTopics = true;
        }
  
        if (! ADCache.TopicList.hasOwnProperty(key)) {
          // Quickly set to debounce additional calls from getting to Post GetAreas
          // Let remainder render logic handle if not "fully" loaded
          ADCache.TopicList[key] = null;

          let payLoad = {
            headers: {
              Authorization: userJWT
            },
            body: {
              regUsr: userID,
              projectID: pid,
              AID: aid
            }
          };

          console.log("POST GetTopics:");
          API.post('adgetprojectareatopic', '/', payLoad ).then(response => {
              if (response.statusCode === 200) {
                ADCache.TopicList[key] = response.body; 
                topicList = ADCache.TopicList[key];
                console.log("new topicList:"+JSON.stringify(topicList));
                //setTopicsLoaded(true); // trigger rerender on first topics load
                getAreaTopicsPartTwo(key);
              }
          }).catch(error => {
            console.log("API Error: GetProjectAreas", error);
          });
        } else
        getAreaTopicsPartTwo(key);
      }
  }

  // 20200904 - Handle user event changes the current selection to trigger UseEffect that performs the call to POST
  const handleChangeArea = async e => {
    ADCache.selectionType = MANUAL_SELECT;
    dispatch(RerenderingQuestionPanel(true));
    if( e !== undefined) {
      if (e.areaID !== selectedArea) {
        dispatch(SelectArea(e.areaID));
        //dispatch(loadQuestionPanel(true));
      }
    }
  }

  useEffect(() => {
    console.log("userEffect(AreaList)...");
    getAreaTopics(selectedProject, selectedArea);
  }, [selectedArea, refreshTopicList]);

  useEffect(() => {
    console.log("userEffect(AreaList) -- Received refreshTopicList");
    getAreaTopics(selectedProject, selectedArea);
  }, [refreshTopicList]);


  console.log("Rendering AreaList...");
  console.log("areaList:"+JSON.stringify(areaList));
  console.log("ADCache.selectedAreaIndex:"+ADCache.selectedAreaIndex);
  console.log("areaList[ADCache.selectedAreaIndex].AID:"+areaList[ADCache.selectedAreaIndex].AID);
  console.log("selectedTopic:"+selectedTopic);
  return (
    <div className={classes.root}>
      {areaList ?
        <NoSsr>
            <Select
              classes={classes}
              styles={selectStyles}
              inputProps={{ id: 'select-area' }}
              defaultValue='none'
              TextFieldProps={{
                label: '',
                InputLabelProps: {
                  htmlFor: 'select-area',
                  shrink: true,
                },
                placeholder: 'select-area',
              }}
              options={
                  areaList.map((area) => ({
                    areaID: area.AID,
                    label: area.AIDName,
                    projectID: area.ProjectID,
                    status: area.Status,
                    value: area.AID
                  }))
              }
              components={components}
              value={areaList[ADCache.selectedAreaIndex].AID}
              onChange={handleChangeArea}
            />
          <div className={classes.divider} />
            <TopicList jwt={jwt} setPBV={setPBV} setPBB={setPBB} rt={rt} ra={ra} frt={frt} fra={fra}></TopicList>
        </NoSsr>
      : null }
    </div>
  );
}

export default AreaList;

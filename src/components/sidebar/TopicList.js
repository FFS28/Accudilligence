// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/Accordion';
import MuiExpansionPanelSummary from '@material-ui/core/AccordionSummary';
import MuiExpansionPanelDetails from '@material-ui/core/AccordionActions';
import Tooltip from '@material-ui/core/Tooltip';
// import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
// import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { Auth, API } from 'aws-amplify';
import reviewStatusLogo from '../../assets/images/review_status_250x250.png';
import SubTopicList from './SubTopicList';
import { SelectTopic, SelectSubTopic } from '../../store/modules/projectRedux';
import { RerenderingQuestionPanel } from '../../store/modules/questionRedux';
import { ADCache, AUTO_SELECT, MANUAL_SELECT } from '../../store/ADCache';

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

const useStyles = makeStyles((theme) => ({
  verticalLineTop: {
    width: 2,
    height: '36%',
    background: '#353535',
    position: 'absolute',
    left: 36,
    top: -2
  },
  verticalLineBottom: {
    width: 2,
    height: '36%',
    background: '#353535',
    position: 'absolute',
    left: 36,
    marginTop: 25
  },
  topicIconBlack: {
    marginRight: 20,
    fontSize: 30,
    marginLeft: 6,
    color: '#353535'
  },
  topicIconGrey: {
    marginRight: 20,
    marginLeft: 6,
    fontSize: 30,
    color: '#afbfaf'
  },
  topicIconWhite: {
    marginRight: 15,
    marginLeft: 8,
    fontSize: 25,
    marginTop: 2
  },
  reviewStatusLogo: {
    marginRight: 20,
    width: 25,
    height: 25,
    marginTop: 1
  },
  topicLabel: {
    fontSize: 19,
    fontFamily: 'HelveticaNeue-CondensedBold,Helvetica Neue',
    marginLeft: -6
  },
  topicDiv: {
    top: 209
  }
}));

const ExpansionPanel = withStyles({
  root: {
    // borderBottom: '1px solid #eee',
    border: '1px solid #fff',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: '#fff',
    // borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 'auto',
    '&$expanded': {
      minHeight: 'auto',
    },
    color: '#000000de'
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0.1, 0),
    display: 'block',
    width: '100%'
  },
}))(MuiExpansionPanelDetails);


export default function TopicList(props) {
  const { jwt, setPBV, setPBB, displayTooltip } = props;
  const classes = useStyles();

  // Project Redux
  const selectedProject = useSelector(state => state.projectRedux.selectedProject);
  const selectedArea = useSelector(state => state.projectRedux.selectedArea);
  const selectedTopic = useSelector(state => state.projectRedux.selectedTopic);
  const selectedSubTopic = useSelector(state => state.projectRedux.selectedSubTopic);
  const refreshTopicList = useSelector(state => state.projectRedux.refreshTopicList);
  const selectedAreaSubTopic = useSelector(state => {
    return state.projectRedux.selectedAreaSubTopic
  });
  const dispatch = useDispatch();

  const [isLastPanel, setIsLastPanel] = useState(false);

  var userID = Auth.userPool.getCurrentUser().username;
  var userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
  var topicList = ADCache.TopicList[selectedProject + "." + selectedArea];
  var subTopicList = (ADCache.SubTopicList[selectedTopic] ? ADCache.SubTopicList[selectedTopic] : null);

  useEffect(() => {
    //console.log("userEffect(TopicList)...");
    //console.log(selectedProject + "/" + selectedArea + "/" + selectedTopic + "/" + selectedAreaSubTopic);
    topicList = ADCache.TopicList[selectedProject + "." + selectedArea];
    //if (selectedTopic)
    //  console.log("useEffect refreshTopicList getSubtopics");
    getSubTopics(selectedTopic);
    window.scrollTo(0, 0);
  }, [selectedTopic, refreshTopicList, selectedAreaSubTopic]);

  function getSubTopicsPartTwo(key, mustDispatch) {
    subTopicList = ADCache.SubTopicList[key];
    //console.log(subTopicList);
    //console.log("ADCache.selectedItemDPID[key]:"+ADCache.selectedItemDPID[key]);
    //console.log("getSubTopicsPartTwo key:"+key);
    // Now need to select the current subTopic which is the current "item". Lot's of logic here if auto or manual or empty
    if (subTopicList && (subTopicList.length > 0)) {
      var indexNewlySelectedSubtopic = 0;
      //console.log("inside layer 1...");
      //console.log("AUTO_SELECT:" + (ADCache.selectionType===AUTO_SELECT));
      if ((ADCache.selectionType === AUTO_SELECT) || (!ADCache.selectedItemDPID[key])) {
        if (!ADCache.selectedItemDPID[key]) {
          mustDispatch = true; // Also need a refresh dispatch when user manually selects a topic that is not previously opened.
        }
        //console.log("inside layer 2...");
        for (var loopi = 0; loopi < subTopicList.length; loopi++) {
          //console.log("inside layer 3...");
          var aSubTopic = subTopicList[loopi];
          if (aSubTopic.pAnsweredCount < aSubTopic.pTotalCount) {
            //console.log("Auto Select SubTopic: "+loopi);
            setIsLastPanel(loopi === (subTopicList.length - 1));
            ADCache.selectedItemDPID[key] = aSubTopic.DPID;
            indexNewlySelectedSubtopic = loopi
            break;
          }
        }
        //console.log("is still null:"+ADCache.selectedItemDPID[key]);
        if (!ADCache.selectedItemDPID[key]) {
          //Manually back-clicked a topic where all questions are already answered with no prior selection
          //Default to first time
          //console.log("inside layer 4");
          setIsLastPanel(false);
          ADCache.selectedItemDPID[key] = subTopicList[0].DPID;
          //console.log("is still null:"+ADCache.selectedItemDPID[key]);
          mustDispatch = true;
        }
      } else {
        // If manually selected, want to retrieve the previous selection if it exists in the cache
        mustDispatch = true;
      }

      if (mustDispatch)
        dispatch(SelectSubTopic(subTopicList[indexNewlySelectedSubtopic]));
    }
  }

  function getSubTopics(tid) {
    var mustDispatch = ADCache.ResetSubTopics;
    if (userID) {
      let key = selectedProject + "." + selectedArea + "." + tid;
      //console.log("SubTopic key:"+key);
      if (ADCache.ResetSubTopics) { // Force reset of subtopicList
        ADCache.SubTopicList = {};
        ADCache.ResetSubTopics = false;
      }

      if (!ADCache.SubTopicList.hasOwnProperty(key)) {
        // Quickly set to debounce additional calls from getting to Post API
        // Let remainder render logic handle if not "fully" loaded
        ADCache.SubTopicList[key] = null;

        let payLoad = {
          headers: {
            Authorization: userJWT
          },
          body: {
            projectID: selectedProject,
            AID: selectedArea,
            TID: tid
          }
        };
        //console.log("POST GetSubTopics: ");
        API.post('getsubtopics', '/', payLoad).then(response => {
          if (response.statusCode === 200) {
            //console.log("got good response");
            //console.log("SubTopic:"+JSON.stringify(response));
            ADCache.SubTopicList[key] = response.body;
            //console.log("GetSubtopic:" + response.body)
            getSubTopicsPartTwo(key, mustDispatch); // Need to call within the promise response
          } else {
            //Handle errors here.
            console.log("Get SubTopics Failed. Please try again a little bit later.");
          }
        }).catch(error => {
          if (error.message.includes("401")) {
            signOut();
          } else {
            console.log(error)
          }
        });
      } else
        getSubTopicsPartTwo(key, mustDispatch);
    }
  }

  const handleChangeTopic = (panel, uiSelectedTopic) => (event, newExpanded) => {

    if (selectedTopic === uiSelectedTopic.TID) {
      return;
    }

    ADCache.selectionType = MANUAL_SELECT;
    ADCache.RefreshQuestions = true;
    dispatch(RerenderingQuestionPanel(true));
    //console.log("newExpanded:"+newExpanded);
    //console.log("panel:"+panel);
    panel === (topicList.length - 1) ? setIsLastPanel(true) : setIsLastPanel(false);
    newExpanded = true
    // bind Question load status to QuestionRedux
    if (newExpanded) {
      dispatch(SelectTopic(uiSelectedTopic.TID));
      // hook will call the following after select topic dispatch
      //getSubTopics(uiSelectedTopic.TID); 
    }
  };

  //console.log("Rendering TopicList");
  //console.log("selectedTopic:"+selectedTopic);
  //console.log("selectedSupTopic:"+selectedSubTopic);
  //console.log("at Render Topic - subTopicList:"+JSON.stringify(subTopicList));
  topicList = ADCache.TopicList[selectedProject + "." + selectedArea];
  if (topicList) {
    return (
      displayTooltip ?
        <Tooltip title="Click here for updates to project areas" placement="top-end">
          <div className={classes.topicDiv}>
            {(selectedSubTopic) ?
              topicList.map((topic, key) => (
                <div key={key}>
                  <ExpansionPanel square expanded={selectedTopic === topic.TID} onChange={handleChangeTopic(key, topic)}>
                    <ExpansionPanelSummary aria-controls="panel-content" className="panel-header" expandIcon={<ExpandMoreIcon />}>
                      {key === 0 ? <span></span> : <span className={classes.verticalLineTop}></span>}
                      {key === topicList.length - 1 ? <span></span> : <span className={classes.verticalLineBottom}></span>}
                      {(selectedTopic === topic.TID) ? <span className={classes.verticalLineBottom}></span> : <span></span>}
                      {topic.AnsweredCount === topic.TotalCount ?
                        <FiberManualRecordIcon className={classes.topicIconBlack} /> :
                        topic.AnsweredCount === 0 ?
                          <RadioButtonUncheckedIcon className={classes.topicIconWhite}></RadioButtonUncheckedIcon> :
                          // <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img> :
                          topic.AnsweredCount > 0 ?
                            <FiberManualRecordIcon className={classes.topicIconGrey} /> :

                            topic.ReviewStatus === "RC" ?
                              <FiberManualRecordIcon className={classes.topicIconGrey} /> :
                              <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img>
                      }
                      <Typography>
                        <span className={classes.topicLabel}>{topic.TIDLStr}</span>
                      </Typography>
                    </ExpansionPanelSummary>
                    {topic.TID === selectedTopic ?
                      <ExpansionPanelDetails>
                        <span className={classes.verticalLine}></span>
                        <SubTopicList tid={topic.TID} selectedItemID={ADCache.selectedItemDPID[selectedProject + "." + selectedArea + "." + topic.TID]} isLastPanel={isLastPanel} jwt={jwt} setPBV={setPBV} setPBB={setPBB} ></SubTopicList>
                      </ExpansionPanelDetails>
                      : null}
                  </ExpansionPanel>
                </div>
              )) :
              <div></div>
            }
          </div>
        </Tooltip>
        :
        <div className={classes.topicDiv}>
          {(selectedSubTopic) ?
            topicList.map((topic, key) => (
              <div key={key}>
                <ExpansionPanel square expanded={selectedTopic === topic.TID} onChange={handleChangeTopic(key, topic)}>
                  <ExpansionPanelSummary aria-controls="panel-content" className="panel-header" expandIcon={<ExpandMoreIcon />}>
                    {key === 0 ? <span></span> : <span className={classes.verticalLineTop}></span>}
                    {key === topicList.length - 1 ? <span></span> : <span className={classes.verticalLineBottom}></span>}
                    {(selectedTopic === topic.TID) ? <span className={classes.verticalLineBottom}></span> : <span></span>}
                    {topic.AnsweredCount === topic.TotalCount ?
                      <FiberManualRecordIcon className={classes.topicIconBlack} /> :
                      topic.AnsweredCount === 0 ?
                        <RadioButtonUncheckedIcon className={classes.topicIconWhite}></RadioButtonUncheckedIcon> :
                        // <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img> :
                        topic.AnsweredCount > 0 ?
                          <FiberManualRecordIcon className={classes.topicIconGrey} /> :

                          topic.ReviewStatus === "RC" ?
                            <FiberManualRecordIcon className={classes.topicIconGrey} /> :
                            <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img>
                    }
                    <Typography>
                      <span className={classes.topicLabel}>{topic.TIDLStr}</span>
                    </Typography>
                  </ExpansionPanelSummary>
                  {topic.TID === selectedTopic ?
                    <ExpansionPanelDetails>
                      <span className={classes.verticalLine}></span>
                      <SubTopicList tid={topic.TID} selectedItemID={ADCache.selectedItemDPID[selectedProject + "." + selectedArea + "." + topic.TID]} isLastPanel={isLastPanel} jwt={jwt} setPBV={setPBV} setPBB={setPBB} ></SubTopicList>
                    </ExpansionPanelDetails>
                    : null}
                </ExpansionPanel>
              </div>
            )) :
            <div></div>
          }
        </div>
    );
  } else {
    return (null);
  }
}


// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//import StarBorder from '@material-ui/icons/StarBorder';
import PlayArrow from '@material-ui/icons/PlayArrow';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
//import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { Auth, API } from 'aws-amplify';
import { GetQuestions, RerenderingQuestionPanel } from '../../store/modules/questionRedux';
import { SelectSubTopic } from '../../store/modules/projectRedux';
import { ADCache, MANUAL_SELECT } from '../../store/ADCache';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: 0,
  },
  listItem: {
    paddingLeft: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    "&,&:focus": {
      backgroundColor: theme.palette.background.paper // or whatever color you want this to be
    }
  },
  inactivelistItem: {
    paddingLeft: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    color: '#bbb',
  },
  listItemDone: {
    paddingLeft: theme.spacing(2),
    paddingTop: 0,
    paddingBottom: 0,
    "&,&:focus": {
      backgroundColor: "#D1D1C1",
      // textDecoration: "line-through"
    },
    "&:hover": {
      // textDecoration: "line-through"
    }
  },
  selectedIcon: {
    minWidth: 0,
  },
  subTopicItemIcon: {
    minWidth: 25
  },
  subTopicIconBlack: {
    fontSize: 24,
    marginLeft: 1,
    color: '#353535',
    margin: '0 20px 0 3px'
  },
  subTopicIconGrey: {
    fontSize: 24,
    marginLeft: 1,
    color: '#afbfaf',
    margin: '0 20px 0 3px'
  },
  subTopicIconWhite: {
    fontSize: 20,
    margin: '0 20px 0 3px',
    color: '#111',
    zIndex: 99
  },
  subTopicIconRightBlank: {
    fontSize: 19,
    color: '#353535',
  },
  subTopicIconRightGrey: {
    fontSize: 19,
    color: '#afbfaf',
  },
  subTopicIconRightWhite: {
    fontSize: 16,
  },
  subTopicIconRightMargin: {
    margin: '0 15px',
  },
  subTopicLabel: {
    fontSize: 14,
    marginLeft: 12
  },
  verticalLineTop: {
    width: 2,
    height: '50%',
    background: '#353535',
    position: 'absolute',
    left: 28,
    top: -9,
    zIndex: 1
  },
  verticalLineBottom: {
    width: 2,
    height: '55%',
    background: '#353535',
    position: 'absolute',
    left: 28,
    marginTop: 17,
    top: 6,
    zIndex: 1
  },
  horzontalLine: {
    width: 20,
    height: 2,
    background: "#353535",
    position: 'absolute',
    left: 37,
  }
}));

//function ListItemLink(props) {
//  return <ListItem button component="a" {...props} />;
//}

export default function SimpleList(props) {
  const { tid, selectedItemID, isLastPanel, jwt, setPBV, setPBB } = props;
  const classes = useStyles();

  // Project Redux
  const selectedProject = useSelector(state => state.projectRedux.selectedProject);
  const selectedArea = useSelector(state => state.projectRedux.selectedArea);
  const selectedTopic = useSelector(state => state.projectRedux.selectedTopic);
  const selectedSubTopic = useSelector(state => state.projectRedux.selectedSubTopic);
  //const loadingQuestionPanel = useSelector(state => state.questionRedux.loadingQuestionPanel);
  const dispatch = useDispatch();

  // Local Render States

  var userID = Auth.userPool.getCurrentUser().username;
  var userJWT = (Auth.user.jwt) ? Auth.user.jwt : jwt;
  var subTopicList = ADCache.SubTopicList[selectedProject + "." + selectedArea + "." + tid];
  var topicKey = selectedProject + "." + selectedArea + "." + selectedTopic;

  useEffect(() => {
    //console.log("userEffect(SubTopicList)..");
    let key = selectedProject + "." + selectedArea + "." + tid;
    subTopicList = ADCache.SubTopicList[key];
    // What comes in as selectedItem is DPID, not index from array render like HandleChange
    //console.log("subTopicList:"+JSON.stringify(subTopicList));
    //console.log("key:"+key);
    if (subTopicList) {
      var found = -1;
      for (var loopi = 0; loopi < subTopicList.length; ++loopi) {
        if (subTopicList[loopi].DPID === ADCache.selectedItemDPID[key]) {
          found = loopi;
          break;
        }
      }
      if (found > -1) {
        // console.log("useEffect found Index:"+found);
        // console.log("subTopicValue:"+JSON.stringify(subTopicList[found]));
        getPADPQ(subTopicList[found]);
        window.scrollTo(0, 0);
      }
    }
  }, [tid, selectedSubTopic]);


  // DO NOT CACHE GETQUESTIONS -- Multi-User situation requires frequent refresh
  function getPADPQ(value) {
    if (userID) {
      let key = value.ProjectID + value.AID + value.TID + value.DPID;
      if (ADCache.QuestionKey.hasOwnProperty(key)) {
        // console.log("Bounced GetQ");
        return; // cached or in progress, debounce.
      } else { // in this case if userID <> cache, let it fall through to rerender
        // Key not yet set, set that to prevent second server call on Dev React, but let it fall through
        ADCache.QuestionKey[key] = '';
      }

      RerenderingQuestionPanel(true);

      let payLoad = {
        headers: {
          Authorization: userJWT
        },
        body: {
          "projectID": value.ProjectID,
          "AID": value.AID,
          "TID": value.TID,
          "DPID": value.DPID
        }
      }

      // console.log("Post GetQ");
      API.post('getmeasures', '/', payLoad).then(response => {
        if (response.statusCode === 200) {
          //console.log("Q body:"+JSON.stringify(response.body));
          ADCache.QuestionKey[key] = response.body;
          setPBV(Math.floor(response.body[0].AnsweredCount * 100 / response.body[0].TotalCount));
          setPBB(Math.floor((response.body[0].AnsweredCount + response.body[0].UnderReviewCount) * 100 / response.body[0].TotalCount));

          // bind primary question list to redux
          dispatch(RerenderingQuestionPanel(false));
          dispatch(GetQuestions(response.body));
          // bind loading statues to questionRedux
          //console.log("loadQuestionPanel:"+loadingQuestionPanel);
          ADCache.QuestionKey = {};
        }
      }).catch(error => {
        console.log("Error: Unexpected error in retrieving questions from project. Please try again later.")
        console.log(error);
        //TODO: For 'Error: Request failed with status code 401' message, signout and default to relogin form
        //TODO REPLACE WITH PRODUCTION HREF
        let domainStr = "localhost:3000/"
        window.location.href = domainStr + "?signin=1";
        window.location.reload();
      });
      ADCache.ResetSubTopics = false;
    }
  }

  const handlerSubTopic = (value) => () => {
    //console.log("handlerSubTopic...");
    ADCache.selectionType = MANUAL_SELECT;
    const currentIndex = subTopicList.indexOf(value);
    dispatch(RerenderingQuestionPanel(true));
    ADCache.selectedItemDPID[topicKey] = value.DPID;

    // bind loading statues to questionRedux
    ADCache.QuestionKey = {}; // reset keys to reload each time, just debounce the current
    dispatch(SelectSubTopic(value));
    getPADPQ(value);
  };

  //console.log("subTopicList:"+JSON.stringify(subTopicList));
  //console.log("selectedTopic:"+selectedTopic);
  //console.log("ADCache.selectedItemDPID:"+JSON.stringify(ADCache.selectedItemDPID));
  //console.log("selectedItemID:"+selectedItemID)
  subTopicList = ADCache.SubTopicList[selectedProject + "." + selectedArea + "." + tid];
  if (subTopicList) {
    // console.log("Render SubTopicList...");
    return (
      <div className={classes.root}>
        {subTopicList.length > 0 ?
          <List component="nav" aria-label="subTopics">
            {subTopicList.map((subTopic, key) => (
              <div key={key}>
                <ListItem
                  button
                  className={subTopic.DPID === selectedItemID ? classes.listItemDone : subTopic.pTotalCount ? classes.listItem : classes.inactivelistItem}
                  onClick={subTopic.pTotalCount ? handlerSubTopic(subTopic) : ""}
                  selected={subTopic.DPID === selectedItemID}
                >
                  <span className={classes.verticalLineTop}></span>
                  {isLastPanel && key === (subTopicList.length - 1) ? <span></span> : <span className={classes.verticalLineBottom}></span>}
                  {/* <span className={classes.horzontalLine}></span> */}
                  {
                    subTopic.pAnsweredCount === 0 ?
                      <RadioButtonUncheckedIcon className={classes.subTopicIconWhite} /> :
                      <ListItemIcon className={classes.subTopicItemIcon}>
                        {subTopic.pAnsweredCount !== subTopic.pTotalCount ?
                          <FiberManualRecordIcon className={classes.subTopicIconGrey} /> :
                          <FiberManualRecordIcon className={classes.subTopicIconBlack} />
                        }
                      </ListItemIcon>
                  }
                  {/* {
                    subTopic.fAnsweredCount === 0 ?
                      <RadioButtonUncheckedIcon className={`${classes.subTopicIconRightWhite} ${classes.subTopicIconRightMargin}`}></RadioButtonUncheckedIcon> :
                      <ListItemIcon className={classes.subTopicItemIcon}>
                        { subTopic.fAnsweredCount === subTopic.fTotalCount ?
                          <FiberManualRecordIcon className={`${classes.subTopicIconGrey} ${classes.subTopicIconRightMargin}`}/> :
                          <FiberManualRecordIcon className={`${classes.subTopicIconRightBlack} ${classes.subTopicIconRightMargin}`}/>
                        }
                      </ListItemIcon> 
                  } */}

                  <ListItemText className={classes.subTopicLabel} primary={subTopic.DPIDLStr} />
                  <ListItemIcon className={classes.selectedIcon}>
                    {subTopic.DPID === selectedItemID ?
                      <PlayArrow /> : ''
                    }
                  </ListItemIcon>
                </ListItem>
              </div>
            ))}
          </List>
          : null}
      </div>
    );
  } else {
    return (null);
  }
}

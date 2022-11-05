import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/Accordion';
import MuiExpansionPanelSummary from '@material-ui/core/AccordionSummary';
import MuiExpansionPanelDetails from '@material-ui/core/AccordionActions';
// import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
// import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import axios from 'axios';
import { Auth, API } from 'aws-amplify';
import reviewStatusLogo from '../../assets/images/review_status_250x250.png';
import SubTopicList from './SubTopicList';
import { getSelectedTopic, loadQuestionPanel } from '../../store/modules/questionRedux';

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
  topicIconPink: {
      marginRight: 20,
      marginLeft: 6,
      fontSize: 30,
      color: '#FFAAFF'
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
      fontFamily: 'HelveticaNeue-CondensedBold,Helvetica Neue'
  },
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

export default function TopicListComponent(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { resTopicList, loadingArea } = props;

  const [topicList, setTopicList] = useState([]);

  const [expanded, setExpanded] = useState(-1);
  const [subTopicList, setSubTopicList] = useState([]);
  const [isLastPanel, setIsLastPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(resTopicList) {
      //console.log("setTopicList:"+JSON.stringify(resTopicList.body));
      setTopicList(resTopicList);
    }
    if(!loadingArea) {
      setExpanded(-1);
    }
  }, [loadingArea, resTopicList]);

  let userID = Auth.userPool.getCurrentUser().username;
  function getAreaTopicDPs(st)
  {
    if (userID) {
        let payLoad = {
          body: {
            targetUsr: userID,
            projectID: st.projectID,
            AID: st.AID,
            TID: st.TID
          }
        }

        API.post('adgettopicdps', '/', payLoad ).then(response => {
          //console.log('subTopicList : ' + JSON.stringify(response.body));
          setSubTopicList(response.body);
          // bind topic anwserCount to questionRedux
          dispatch(getSelectedTopic(st));
          setLoading(false);
        }).catch(error => {
          console.log("API Error: GetTopicDPs", error);
        });

    }
  }

  const handleChangeTopic = (panel, selectedTopic) => (event, newExpanded) => {
    // console.log(selectedTopic);
    setExpanded(newExpanded ? panel : -1);
    panel === (topicList.length - 1) ? setIsLastPanel(true) : setIsLastPanel(false);
    setLoading(true);

    // bind Question load status to QuestionRedux
    dispatch(loadQuestionPanel(true));
    getAreaTopicDPs(selectedTopic);
  };

  return (
      <div>
          {!loadingArea ?
            topicList.map((topic, key) => (
              <div key={key}>
                <ExpansionPanel square expanded={expanded === key} onChange={handleChangeTopic(key, topic)}>
                    <ExpansionPanelSummary aria-controls="panel-content" className="panel-header" expandIcon={<ExpandMoreIcon />}>
                        {key === 0 ? <span></span> : <span className={classes.verticalLineTop}></span>}
                        {key === topicList.length - 1 ? <span></span> : <span className={classes.verticalLineBottom}></span>}
                        {key === expanded ? <span className={classes.verticalLineBottom}></span> : <span></span>}
                        {topic.AnsweredCount === topic.TotalCount ?
                              <FiberManualRecordIcon className={classes.topicIconBlack} /> : 
                            topic.AnsweredCount === 0 ? 
                                <RadioButtonUncheckedIcon className={classes.topicIconWhite}></RadioButtonUncheckedIcon> :
                                // <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img> :
                            topic.AnsweredCount > 0 ?
                                <FiberManualRecordIcon className={classes.topicIconPink} /> :
                                
                                topic.ReviewStatus === "RC" ?
                                  <FiberManualRecordIcon className={classes.topicIconPink} /> :
                                  <img className={classes.reviewStatusLogo} src={reviewStatusLogo} alt="reviewStatusLogo"></img>
                        }
                        <Typography>
                            <span className={classes.topicLabel}>{topic.TIDLStr}</span>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <span className={classes.verticalLine}></span>
                        <SubTopicList resSubTopicList={subTopicList} isLastPanel={isLastPanel} loading={loading}></SubTopicList>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            )) :
            <div></div>
          }
      </div>
  );
}

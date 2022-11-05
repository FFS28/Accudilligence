import React, { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import axios from 'axios';

import { submitQuestionResponse, submittedFollowUpQuestions } from '../../../store/modules/questionRedux';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '10px 0 0 20px'
    },
    qContent: {
      marginBottom: theme.spacing(1)
    }, 
    qCommentGrid: {
      marginBottom: theme.spacing(4)
    },
    qCommentLabel: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    textField: {
        width: '95%',
        marginTop: 5
    },
    qCommentDescribe: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 5
    },
    submitButton: {
      color: '#fff',
      position: 'absolute',
      bottom: 0,
      right: 1
    },
    respDateTime: {
      color: '#868282',
      position: 'absolute',
      bottom: -5,
      right: 5,
      fontStyle: 'italic'
    }
}));

const SubmitButton = withStyles((theme) => ({
  root: {
      color: '#fff',
      backgroundColor: '#355c35',
      '&:hover': {
          backgroundColor: green[700],
      },
      borderRadius: 0,
      fontSize: 13,
      height: 30,
      fontWeight: 'bold',
  },
}))(Button);

export default function MultipleCheckBox(props) {
  const classes = useStyles();
  const dispatch =  useDispatch();

  const { pQuestion, declinedPanel, pQkey } = props;

  const [pickList, setPickList] = useState([]);
  const [respData, setRespData] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [checkIDList, setCheckIDList] = useState([]);
  const [usrComment, setUsrComment] = useState('');
  const [submitted, setSubmitted] = useState(0);
  const [respInitials, setRespInitials] = useState('');
  const [respDT, setRespDT] = useState('');
  const [declined, setDeclined] = useState(null);

  useEffect(() => {
    setSubmitted(pQuestion.submitted);
    setUsrComment(pQuestion.usrComment);
    setRespInitials(pQuestion.respInitials);
    setRespDT(pQuestion.respDT);
    setDeclined(declinedPanel);
  }, [declinedPanel, pQuestion.respDT, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment])
  
  useEffect(() => {
    if (pQuestion.pickList !== null) {
      setPickList(pQuestion.pickList);
    }
    if (pQuestion.respData) {
      setRespData(pQuestion.respData)
    }
  }, [pQuestion.pickList, pQuestion.respData])

  const handleCheck = checkedItem => (e) => {
    if (e.target.checked) {
        const checkedItems = [checkedItem, ...checkList];
        const checkIDItems = [checkedItem.id, ...checkIDList];
        setCheckList(checkedItems);
        setCheckIDList(checkIDItems);
    } else {
        const checkedItemIndex = checkList.findIndex(item => item.id === checkedItem.id);
        const checkedItems = [
            ...checkList.slice(0, checkedItemIndex),
            ...checkList.slice(checkedItemIndex + 1)
        ]
        setCheckList(checkedItems);

        const checkedItemIDIndex = checkIDList.findIndex(item => item === checkedItem.id);
        const checkedIDItems = [
            ...checkIDList.slice(0, checkedItemIDIndex),
            ...checkIDList.slice(checkedItemIDIndex + 1)
        ]
        setCheckList(checkedIDItems);
    }
    // console.log(checkList);
  };

  const handleChangeComment = (e) => {
    setUsrComment(e.target.value);
  }

  const handleSubmit = () => {
    console.log(checkIDList);
    ajaxRequest();
  }
  
  const ajaxRequest = () => {
    axios
      .post(
          window.$proxyUrl + window.$submitUrl, {
            "projectID": pQuestion.ProjectID,
            "AID": pQuestion.AID,
            "TID": pQuestion.TID,
            "DPID": pQuestion.DPID,
            "Sort": pQuestion.Sort,
            "isOptOut": declined ? 1 : 0,
            "respType": pQuestion.RespType,
            "response": !declined ? checkIDList : null,
            "usrComment": usrComment,
            "hiddenComment": "Test Hidden",
            "targetUsr": "tj0567@yahoo.com"          
      })
      .then((res) => {
          if (res.data.statusCode === 200) {
            // bind submit status to questionRedux
            dispatch(submitQuestionResponse(200, pQkey));

            // console.log(res.data.body);
            const resBody = res.data.body;
            setSubmitted(resBody[0].submitted);
            setRespInitials(resBody[0].respInitials);
            setRespDT(resBody[0].respDT);
            setRespData(resBody[0].respData);
            setUsrComment(resBody[0].usrComment);
            setDeclined(true);

            if (resBody[1]) {
              getFollowUpQuestions(resBody[1]);
            }
          }
          else {
            console.log(res.data.body);
          }
      })
      .catch((err) => console.log(err));
  }

  const getFollowUpQuestions = (submittedResponse) => {
    const resLen = submittedResponse.length;
    
    for (let i = 0; i < resLen; i ++) {
      const followUp = submittedResponse[i].FollowUp;
      const areaID = followUp.AID;
      console.log(followUp);

      const proxyUrl = window.$proxyUrl;
      if (areaID === 'TA') {
        requestFollowUpQuestions(followUp, proxyUrl + window.$followUpTAUrl);
      } else if (areaID === 'DO') {

      } else if (areaID === 'OR') {

      } else {

      }
    }
  }

  const requestFollowUpQuestions = (followUp, postUrl) => {
    axios
      .post(postUrl, {
        "projectID": followUp.ProjectID,
        "AID": followUp.AID,
        "Sort": followUp.Sort,
        "targetUsr": "tj0567@yahoo.com"
      })
      .then((res) => {
        if (res.data.statusCode === 200) {
          console.log(res.data.body);
          // bind submit status to questionRedux
          dispatch(submittedFollowUpQuestions(res.data.body, pQkey));
        }
        else {
          console.log(res.data.body);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={classes.root}>
          <Grid container spacing={1}>
            {!declined ?
              pickList.map((item, key) => (
                  <Grid item xs={12} sm={4} key={key}>
                      <Checkbox
                      color="default"
                      onChange={handleCheck(item)}
                      inputProps={{ 'aria-label': 'checkbox with default color' }}
                      disabled={item.enable ? true: false}/>
                      <span>{item.title}</span>
                  </Grid>
                  )
              ) : null
            }
            {submitted === 1 ? 
              !declined ?
                respData.map((item, key) => (
                  <Grid item xs={12} sm={4} key={key}>
                      <Checkbox
                        color="default"
                        checked
                        disabled/>
                      <span>{item}</span>
                  </Grid>
                  )
                ) : null
              : null
            }
            <Grid item xs={12} className={classes.qCommentGrid}>
                {!declined ?
                  pQuestion.AllowComment === 1 ?
                    <>
                    <Typography className={classes.qCommentLabel}>
                        {pQuestion.cText}
                    </Typography>
                    <TextField
                        label=""
                        id="outlined-size-small"
                        defaultValue=""
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        onChange={handleChangeComment}
                        />
                    <Typography className={classes.qCommentDescribe}>
                        {pQuestion.hText}
                    </Typography>
                    </>
                    : null
                  :null
                }
                {submitted === 1 ?
                  usrComment ? 
                    <Typography className={classes.qCommentLabel}>
                        Additional Comment : {usrComment}
                    </Typography>
                    : null
                  : null
                }
            </Grid>
            <Grid item xs={2}>
                {submitted === 0 ?
                      <SubmitButton variant="contained" color="primary" className={classes.submitButton} onClick={handleSubmit}>
                          Submit
                      </SubmitButton> : 
                      <Typography className={classes.respDateTime}>
                        {respInitials + ' ' + respDT}
                      </Typography>
                }
            </Grid>
          </Grid>
    </div>
  );
}
// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect, useRef} from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
//import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { green } from '@material-ui/core/colors';
import { Auth, API } from 'aws-amplify';
import { SubmitQuestionResponse, SubmitFollowUpQuestions } from '../../../store/modules/questionRedux';
import { ADCache } from '../../../store/ADCache';
import { RefreshAreaList, RefreshTopicList } from '../../../store/modules/projectRedux';

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin:'10px 0 0 10px',
        width: '90%',
        flexGrow: 1
    },
    qContent: {
      marginBottom: theme.spacing(1)
    }, 
    tdValign: {
      verticalAlign: 'top'
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
      bottom: 5,
      left: 30
    },
    checkButton: {
      marginRight: 50,
    },
    qCheckFont: {
      fontFamily:'"Arial Narrow", "Open Sans", "Roboto Condensed", "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue"',
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize:'0.75em',
      fontWidth: 300,
      display:'block'
    },
    qTextNoWrap: {
      whiteSpace: 'nowrap',
      width: '95%'
    },
    respDateTime: {
      color: '#7d7d7d',
      position: 'absolute',
      bottom: -5,
      right: 5,
      fontSize:'0.2em',
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
  const [checkIDList, setCheckIDList] = useState([]);
  const [usrComment, setUsrComment] = useState('');
  const [submitted, setSubmitted] = useState(0);
  const [respInitials, setRespInitials] = useState('');
  const [respDT, setRespDT] = useState('');
  const [declined, setDeclined] = useState(false);
  const [minSubmitValid, setMinSubmitValid] = useState(false);

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
    var checkIDItems = [];
    var touched = false;
    if (e.target.checked) {
        if (! checkIDList.includes(checkedItem.id)) {
          checkIDItems = [checkedItem.id, ...checkIDList];
          touched = true;
        }
    } else {
        if (checkIDList.includes(checkedItem.id)) {
          if (checkIDList.length !== 1) {
            var checkedItemIndex = checkIDList.indexOf(checkedItem);
            checkIDItems = [
              ...checkIDList.slice(0, checkedItemIndex),
              ...checkIDList.slice(checkedItemIndex + 1)
            ];
          }
          touched = true;
        }
    }
    if (touched) {
      setCheckIDList(checkIDItems);
      setMinSubmitValid(checkIDItems.length > 0);
      // console.log("items:"+checkIDItems);
      // console.log("len:"+checkIDItems.length);
    }
  };

  const handleChangeComment = (e) => {
    setUsrComment(e.target.value);
  }

  let userID = Auth.userPool.getCurrentUser().username;
  let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
  function checkQuestionSubmit()
  {
    if (userID) {
        let payLoad = {
          headers: {
            Authorization: userJWT
          },
          body: {
            projectID: pQuestion.ProjectID,
            AID: pQuestion.AID,
            TID: pQuestion.TID,
            DPID: pQuestion.DPID,
            QID: pQuestion.QID,
            MID: pQuestion.MID,
            MVID: pQuestion.MVID,
            isOptOut: declined ? 1 : 0,
            respType: pQuestion.RespType,
            response: !declined ? checkIDList : null,
            usrComment: usrComment,
            hiddenComment: ""
          }
        }
        // console.log(payLoad);
        API.post('postresponses', '/', payLoad ).then(response => {
          //console.log("Fetched areas:"+JSON.stringify(response));
          if (response.statusCode === 200) {
            // bind submit status to questionRedux
            dispatch(SubmitQuestionResponse(200, pQkey));

            // console.log(res.data.body);
            const resBody = response.body;
            setSubmitted(resBody[0].submitted);
            setRespInitials(resBody[0].respInitials);
            setRespDT(resBody[0].respDT);
            setRespData(resBody[0].respData);
            setUsrComment(resBody[0].usrComment);

            for (var i = 1; i < resBody.length; i++) {
                //console.log(resBody[i]);
                if (resBody[i].hasOwnProperty('SPECIAL_ACTION')) {
                  if (resBody[i].SPECIAL_ACTION === "ReloadTopics") {
                    ADCache.ResetTopics = true;
                    ADCache.ResetSubTopics = true;
                    dispatch(RefreshTopicList(Date.now()));
                  } else if (resBody[i].SPECIAL_ACTION === "ReloadAreas") {
                    ADCache.ResetAreas = true;
                    ADCache.ResetTopics = true;
                    ADCache.ResetSubTopics = true;
                    ADCache.selectTooltip = true;
                    dispatch(RefreshAreaList(Date.now()));
                  } else if (resBody[i].SPECIAL_ACTION === "Finished") {
                    console.log("NEED TO SUPPORT FINISH WITH RESPONSES")
                  }
                } else if (resBody[i].hasOwnProperty('FollowUp')) {
                  getFollowUpQuestions(resBody[i].FollowUp);
                }
            }
          } else { 
            console.log(response.body);
          }
          ADCache.disableSubmit = false;
      }).catch(error => {
        console.log("API Error: PostDPQ RBG", error);
        let domainStr = "localhost:3000/"
        window.location.href = domainStr + "?signin=1";
        window.location.reload();
      });
    }
  }
  const handleSubmit = () => {
    // NEED TO VALIDATE:
    //   EMAIL FORMAT
    //   AT LEAST ONE AREA CHECKED ON FIRST SUBMISSION. CAN BE ZERO AFTER THAT.
    //
    if (ADCache.disableSubmit)
      return;
    ADCache.disableSubmit = true;
    checkQuestionSubmit();
  }
  
  const getFollowUpQuestions = (submittedResponse) => {
    const resLen = submittedResponse.length;
    
    for (let i = 0; i < resLen; i ++) {
      const followUp = submittedResponse[i];
      requestFollowUpQuestions(followUp);
    }
  }

  const requestFollowUpQuestions = (followUp) => {
    if (userID) {
      let payLoad = {
        headers: {
          Authorization: userJWT
        },
        body: {
          projectID: followUp.ProjectID,
          AID: followUp.AID,
          QID: followUp.QID
        }
      }
      API.post('getmeasures', '/', payLoad ).then(response => {
        if (response.statusCode === 200) {
          // console.log(response.body);
          // bind submit status to questionRedux
          dispatch(SubmitFollowUpQuestions(response.body, pQkey));
        }
        else {
          console.log("Error: Unexpected error in retrieving questions from server. Please try again later.");
          console.log(response.body);
        }
      }).catch(error => { 
        if (error.message.includes("401")) {
          signOut();
        } else {
          console.log(error)
        }
    });
    }
  }

  return (
    <div className={classes.root}>
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
            {submitted === 0 ?
              !declined ?
                pickList.map((item, key) => (
                  pickList.length > 2 
                    ?
                      <Grid item xs={3} sm={3} zeroMinWidth key={key}>
                        <FormControlLabel label={<span className={classes.qCheckFont}>{item.title}</span>} labelPlacement="end"
                          control={
                            <Checkbox
                              color="default"
                              onChange={handleCheck(item)}
                              disabled={(item.enable && (item.id !== -1)) ? true: false}
                            />
                          }
                        />
                        {/*}
                        <table>
                          <tbody>
                            <tr>
                              <td className={classes.tdValign}><Checkbox
                                    color="default"
                                    onChange={handleCheck(item)}
                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                    disabled={(item.enable && (item.id !== -1)) ? true: false}/></td>
                              <td className={classes.qCheckFont}>{item.title}</td>
                            </tr>
                          </tbody>
                        </table>
                        */}
                      </Grid>
                    : 
                      <Grid item xs={6} zeroMinWidth key={key}>
                        <FormControlLabel label={<span className={classes.qTextNoWrap}>{item.title}</span>} labelPlacement="end"
                          control={
                            <Checkbox
                              color="default"
                              onChange={handleCheck(item)}
                              disabled={(item.enable && (item.id !== -1)) ? true: false}
                            />
                          }
                        />
                        {/*
                        <table className={classes.qTextNoWrap}>
                          <tbody>
                            <tr>
                              <td className={classes.tdValign}><Checkbox
                                    color="default"
                                    onChange={handleCheck(item)}
                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                    disabled={(item.enable && (item.id !== -1)) ? true: false}/></td>
                              <td className={classes.qCheckFont}>{item.title}</td>
                            </tr>
                          </tbody>
                        </table>
                        */}
                      </Grid>
                )) : null
            : !declined ?
                (respData != null) ?
                  respData.map((item, key) => (
                    <Grid item xs={6} zeroMinWidth key={key}>
                      <span className={classes.qCheckFont}><Checkbox color="default" checked disabled/> {item}</span>
                    </Grid>
                  )
                ) : null
              : null
            }
              {submitted === 0 ? 
                !declined ?
                  <div>
                    {pQuestion.AllowComment === 1 ?
                      <Grid item xs={12} className={classes.qCommentGrid}>
                        <div className={classes.qCommentLabel}>{pQuestion.cText}</div>
                        <TextField
                            label=""
                            id="outlined-size-small"
                            defaultValue=""
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            onChange={handleChangeComment}
                            />
                        <div className={classes.qCommentDescribe}>{pQuestion.hText}</div>
                      </Grid>
                    : null}
                    {pQuestion.hText != null
                      ?
                        <div className={classes.qCommentDescribe}>{pQuestion.hText}</div>
                      : null}
                  </div>
                :null
              :
                !declined ?
                  usrComment ? 
                    <Grid item xs={12} className={classes.qCommentGrid}>
                      <div className={classes.qCommentLabel}>Additional Comment : {usrComment}</div>
                    </Grid>
                  : null
                : null
              }

              <Grid item xs={2}>
                  {submitted === 0 ?
                    minSubmitValid ?
                      <div className="ad-margin-t-50">
                        <SubmitButton variant="contained" disabled={ADCache.disableSubmit} color="primary" className={classes.submitButton} onClick={handleSubmit}>
                            Submit
                        </SubmitButton>
                      </div>
                    : null
                  : 
                    <div className={classes.respDateTime}>{respInitials + ' ' + respDT}</div>
                  }
              </Grid>
          </Grid>
    </div>
  );
}
// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { Auth, API } from 'aws-amplify';

import { SubmitQuestionResponse, SubmitFollowUpQuestions } from '../../../store/modules/questionRedux';
import { ADCache } from '../../../store/ADCache';
import { RefreshAreaList, RefreshTopicList } from '../../../store/modules/projectRedux';


// eslint-disable-next-line
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin:'10px 0 0 20px'
    },
    qContent: {
      marginBottom: theme.spacing(1)
    }, 
    qCommentGrid: {
      marginBottom: theme.spacing(4)
    },
    qCommentLabel: {
      color: '#5c5c5c',
      fontSize:'0.8em'
    },
    textField: {
        width: '95%',
        marginTop: 5
    },
    qCommentDescribe: {
      fontSize: '0.77em',
      marginBottom: 5,
      marginRight:'5%',
      marginLeft:'auto',
      textAlign:'right',
      color:'red'
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
      fontFamily:'"Open Sans Light", "Roboto Condensed", "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue"',
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize:'0.95em',
      color: '#5c5c5c',
      marginRight: 18
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

export default function EmailInvite(props) {
  const classes = useStyles();
  const dispatch =  useDispatch();

  const { pQuestion, declinedPanel, pQkey } = props;

  const [respData, setRespData] = useState([]);
  //const [checkIDList, setCheckIDList] = useState([]);
  const [usrComment, setUsrComment] = useState(''); // Use instead for email address
  const [submitted, setSubmitted] = useState(0);
  const [respInitials, setRespInitials] = useState('');
  const [respDT, setRespDT] = useState('');
  const [declined, setDeclined] = useState(false);
  const [emailFirstName, setEmailFirstName] = useState(''); // submit as HiddenComment
  const [emailFormatValid, setEmailFormatValid] = useState(false);
  const [nameIsValid, setNameIsValid] = useState(false);
  const [minSubmitValid, setMinSubmitValid] = useState(pQuestion.submitted);
  //const [textFieldValues, setTextFieldValues] = useState({});
  const [targetDomain, setTargetDomain] = useState('');
  const [rerender, setReRender] = useState(0);

  useEffect(() => {
    if (pQuestion) {
      setSubmitted(pQuestion.submitted);
      setUsrComment(pQuestion.usrComment);
      if (pQuestion.usrComment !== null) {
        if ((targetDomain === '') && pQuestion.usrComment.startsWith("@",0)) {
          setTargetDomain(pQuestion.usrComment);
        }
      }
      setRespInitials(pQuestion.respInitials);
      setRespDT(pQuestion.respDT);
      setDeclined(declinedPanel);
      setReRender(Date.now());
    }
  }, [declinedPanel, pQuestion.respDT, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment])
  
  useEffect(() => {
    if (pQuestion.pickList != null) {
      ADCache.emailParticipantAIDCache[pQuestion.QID] = [];

      //console.log(pQuestion.pickList);

      for (var i = 0; i < pQuestion.pickList.length; ++i) {
        if (pQuestion.pickList[i].checked === 1) {
          if (! (ADCache.emailParticipantAIDCache[pQuestion.QID].includes(pQuestion.pickList[i].id))) {
            ADCache.emailParticipantAIDCache[pQuestion.QID].push(pQuestion.pickList[i].id);
          }
        } else {
          if (ADCache.emailParticipantAIDCache[pQuestion.QID].includes(pQuestion.pickList[i].id)) {
            var io = ADCache.emailParticipantAIDCache[pQuestion.QID].indexOf(pQuestion.pickList[i].id);
            ADCache.emailParticipantAIDCache[pQuestion.QID].splice(io,1);
          }
        }
      }
      setReRender(Date.now());
    }

    if (pQuestion.respData) {
      setRespData(pQuestion.respData);
    }
  }, [pQuestion.pickList, pQuestion.respData])

  useEffect(() => {
    // console.log("rerender");
  }, [rerender])

  const handleCheck = checkedItem => (e) => {
    //console.log(JSON.stringify(checkedItem));
    //console.log(e.target.checked);
    if (e.target.checked) {
      if (ADCache.emailParticipantAIDCache[pQuestion.QID].indexOf(checkedItem.id) < 0) {
        //console.log("adding...");
        ADCache.emailParticipantAIDCache[pQuestion.QID].push(checkedItem.id);
        //console.log(ADCache.emailParticipantAIDCache[pQuestion.QID]);
      }
    } else {
      //console.log("removing from:"+ADCache.emailParticipantAIDCache[pQuestion.QID]);
      var io = ADCache.emailParticipantAIDCache[pQuestion.QID].indexOf(checkedItem.id);
      if (io >= 0)
        ADCache.emailParticipantAIDCache[pQuestion.QID].splice(io,1);

      //console.log("new cache:"+ADCache.emailParticipantAIDCache[pQuestion.QID]);
    }
    setMinSubmitValid(ADCache.emailParticipantAIDCache[pQuestion.QID].length > 0);
    setReRender(Date.now());
  };

  const handleChangeComment = (e) => {
    var emailStr = ""

    if (e.target.name === "contributorFirstName") {
      if (e.target.value !== "") {
        // eslint-disable-next-line
        var outString = e.target.value.replace(/[`~!@#$%^&*()|+=?;'",<>\{\}\[\]\\\/]/gi, '');
        setEmailFirstName(outString);
        if (outString.length > 0)
          setNameIsValid(true);
      } else {
        setEmailFirstName(e.target.value);
        setNameIsValid(false);
      }
    } else if (e.target.name === "contributorEmail") {
      setUsrComment(e.target.value);
      var isValid = validEmailRegex.test(e.target.value)
      //console.log("isValid"+isValid);
      //console.log("domain:"+targetDomain);
      //console.log("value:"+e.target.value);
      setEmailFormatValid(isValid && (e.target.value.endsWith(targetDomain)));
    }
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
            response: !declined ? ADCache.emailParticipantAIDCache[pQuestion.QID] : null,
            usrComment: usrComment,
            hiddenComment: emailFirstName
          }
        }
        //console.log(payLoad);
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
        if (error.message.includes("401")) {
          signOut();
        } else {
          console.log(error)
        }
      });
    }
  }
  const handleSubmit = () => {
    if (emailFormatValid && nameIsValid && (submitted || minSubmitValid)) {
      ADCache.disableSubmit = true;
      checkQuestionSubmit();
    }
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
          console.log(response.body);
          // bind submit status to questionRedux
          dispatch(SubmitFollowUpQuestions(response.body, pQkey));
        }
        else {
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
        {((submitted === 0) && rerender) ? 
            <Grid container spacing={1}>
                <Grid item xs={12} className={classes.qCommentGrid}>
                  <div className={classes.qCommentLabel}>Contributor's First Name:</div>
                  <TextField
                      label=""
                      id="contributorFirstName"
                      name="contributorFirstName"
                      defaultValue=""
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                      error={! nameIsValid}
                      onChange={handleChangeComment}
                  />
                </Grid>
                <Grid item xs={12} className={classes.qCommentGrid}>
                  <div className={classes.qCommentLabel}>Contributor's Email:</div>
                  <TextField
                      label=""
                      id="contributorEmail"
                      name="contributorEmail"
                      defaultValue={targetDomain}
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                      error={! emailFormatValid}
                      onChange={handleChangeComment}
                      />
                  {emailFormatValid ? null : <div className={classes.qCommentDescribe}>Email domain must match</div>}
                </Grid>
                {ADCache.emailParticipantAIDCache[pQuestion.QID] ?
                    pQuestion.pickList.map((item, key) => (
                        <Grid item xs={12} key={key}>
                            <Checkbox
                              color="default"
                              checked={ADCache.emailParticipantAIDCache[pQuestion.QID].includes(item.id)}
                              onChange={handleCheck(item)}
                              inputProps={{ 'aria-label': 'checkbox with default color' }}
                              disabled={false}
                            />
                            <span classes={{label: classes.qCheckFont}}>{item.title}</span>
                        </Grid>
                    )) 
                : null }
                {(!minSubmitValid) ?
                  <div className={classes.qCommentDescribe}>
                    Please select 1 or more areas for the Contributor when initiating this request.
                  </div>
                : null}
            </Grid>
        :
            usrComment ? 
              <Grid item xs={12} className={classes.qCommentGrid}>
                <div className={classes.qCommentLabel}>{pQuestion.cText} {usrComment}</div>

                {ADCache.emailParticipantAIDCache[pQuestion.QID] ?
                  pQuestion.pickList.map((item, key) => (
                    item.checked ?
                      <Grid item xs={12} m={4} key={key}>
                          <Checkbox
                            color="default"
                            checked={ADCache.emailParticipantAIDCache[pQuestion.QID].includes(item.id)}
                            disabled
                          />
                          <span className={classes.qCommentLabel}>{item.title}</span>
                      </Grid>
                    : null
                  ))
                : null }

              </Grid>
            : null
        }

          <Grid item xs={2}>
              {submitted === 0 ?
                (emailFormatValid && nameIsValid && minSubmitValid) ?
                  <div className="ad-padding-t-40">
                    <SubmitButton variant="contained" disabled={ADCache.disableSubmit} color="primary" className={classes.submitButton} onClick={handleSubmit}>
                        Submit
                    </SubmitButton> 
                  </div>
                : null
              :
                <div className={classes.respDateTime}>{respInitials + ' ' + respDT}</div>
              }
          </Grid>
    </div>
  );
}
// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
        margin:'10px 0 0 20px',
        "& .MuiTextField-root": {
          margin: theme.spacing(1),
        },
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
    textArea: {
      height: '75px !important',
      resize: 'both'
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

export default function TextArea(props) {
    const classes = useStyles();
    const dispatch =  useDispatch();

    const { pQuestion, declinedPanel, pQkey } = props;
    const [inputText, setInputText] = useState('');

    const [usrComment, setUsrComment] = useState('');
    const [submitted, setSubmitted] = useState(0);
    const [respInitials, setRespInitials] = useState('');
    const [respDT, setRespDT] = useState('');
    const [respData, setRespData] = useState('');
    const [declined, setDeclined] = useState(false);

    useEffect(() => {
        setSubmitted(pQuestion.submitted);
        setUsrComment(pQuestion.usrComment);
        setRespInitials(pQuestion.respInitials);
        setRespDT(pQuestion.respDT);
        setDeclined(declinedPanel);
    }, [declinedPanel, pQuestion.respDT, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment])

    const handleChangeTextArea = (e) => {
        setInputText(e.target.value);
    }

    const handleChangeComment = (e) => {
      setUsrComment(e.target.value);
    }

    let userID = Auth.userPool.getCurrentUser().username;
    let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
    function textAreaSubmit()
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
              response: !declined ? inputText : null,
              usrComment: usrComment,
              hiddenComment: ""
            }
          }

          API.post('postresponses', '/', payLoad ).then(response => {
            //console.log("Fetched areas:"+JSON.stringify(response));
            if (response.statusCode === 200) {
              // bind submit status to questionRedux
              dispatch(SubmitQuestionResponse(200, pQkey));

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
      if (inputText.length > 0) {
        ADCache.disableSubmit = true;
        textAreaSubmit();
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

    //console.log(respData);
    return (
        <div className={classes.root}>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
                <Grid item xs={12} className={classes.qContent}>
                  {submitted === 0 ?
                    !declined ?
                      <TextareaAutosize
                        aria-label="Response"
                        placeholder="Please enter comments here..."
                        defaultValue=""
                        className={classes.textArea}
                        onChange={handleChangeTextArea}
                      /> 
                    : null
                  : !declined ? 
                      (respData != null) ?
                        <TextareaAutosize
                          aria-label="Response"
                          defaultValue={pQuestion.respData}
                          className={classes.textArea}
                          disabled
                        /> 
                      : null
                    : null
                  }
                  </Grid>
                  {submitted === 0 ?
                    !declined ?
                      pQuestion.AllowComment === 1 ?
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
                      :null
                    :null
                  :
                    !declined ?
                      usrComment ? 
                        <Grid item xs={12} className={classes.qCommentGrid}>
                          <div className={classes.qCommentLabel}>Additional Comment : {usrComment}</div>
                        </Grid>
                      : null
                    :null
                  }
                  <Grid item xs={2}>
                      {submitted === 0 ?
                        (inputText.length !== 0) ?
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
            </Grid>
        </div>
    );
}
// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
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
        margin:'10px 0 0 10px',
        width: '90%',
        flexGrow: 1
    },
    qContent: {
      marginBottom: theme.spacing(1)
    }, 
    qCommentGrid: {
      marginTop: 0,
      marginBottom: theme.spacing(1)
    },
    qSubmittedContent: {
      marginBottom: theme.spacing(1),
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
        fontSize: '0.85em',
        fontStyle: 'italic',
        marginTop: 5
    },
    submitButton: {
      color: '#fff',
      position: 'absolute',
      bottom: 5,
      left: 30
    },
    // slider
    pointValue: {
      marginTop: 4,
      fontWeight: 'bold',
      fontSize: '0.8em',
    },
    startPoint: {
      marginRight: 0,
      marginLeft: 5
    },
    endPoint: {
      marginLeft: 9
    },
    movePoint: {
      marginLeft: 11,
      border: '2px solid #555',
      padding: '5px',
      marginLeft: 10
    },
    qFont: {
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

const PrettoSlider = withStyles({
  root: {
    color: '#355c35',
    height: 8,
    width: 300
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 10,
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4,
    borderColor: '#80bdff'
  },
})(Slider);

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

export default function LowToHighSlider(props) {
    const classes = useStyles();
    const dispatch =  useDispatch();

    const { pQuestion, declinedPanel, pQkey } = props;

    const [sliderVal, setSliderVal] = useState(50);

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
      setRespData(pQuestion.respData);
      setDeclined(declinedPanel);
    }, [declinedPanel, pQuestion.respDT, pQuestion.respData, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment])

    const startPointClass = classNames(classes.pointValue, classes.startPoint);
    const endPointClass = classNames(classes.pointValue, classes.endPoint);
    const movePointClass = classNames(classes.pointValue, classes.movePoint);

    const handleSliderChange = (event, newValue) => {
      setSliderVal(newValue);
    };

    const handleChangeComment = (e) => {
      setUsrComment(e.target.value);
    }

    let userID = Auth.userPool.getCurrentUser().username;
    let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
    function sliderSubmit()
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
              response: !declined ? sliderVal : null,
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
              console.log(resBody[i]);
              if (resBody[i].hasOwnProperty('SPECIAL_ACTION')) {
                if (resBody[i].SPECIAL_ACTION === "ReloadTopics") {
                  ADCache.ResetTopics = true;
                  ADCache.ResetSubTopics = true;
                  dispatch(RefreshTopicList(Date.now()));
                } else if (resBody[i].SPECIAL_ACTION === "ReloadAreas") {
                  ADCache.ResetAreas = true;
                  //ADCache.ResetTopics = true;
                  //ADCache.ResetSubTopics = true;
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
      if (ADCache.disableSubmit)
        return;

      ADCache.disableSubmit = true;
      sliderSubmit();
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
          <Grid container alignItems="flex-start" spacing={1}>
                {submitted === 0 ?
                  !declined ?
                    <>
                      <Grid item xs={1}>
                        <span className={startPointClass}>0%</span>
                      </Grid>
                      <Grid item xs={9} className={classes.qContent}>
                        <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={50} onChange={handleSliderChange}/>
                      </Grid>
                      <Grid item xs={2}>
                        <span className={endPointClass}>100%</span>
                        <span className={movePointClass}>{sliderVal}%</span>
                      </Grid>
                    </>
                  : null
                : !declined ?
                    (respData != null) ?
                      <>
                        <Grid item xs={10} className={classes.qSubmittedContent}>
                          <span className={movePointClass}>{respData}%</span>
                        </Grid>
                        <Grid item xs={2}></Grid>
                      </>
                    : null
                  : null
                }

                {submitted === 0 ?
                  !declined ?
                    pQuestion.AllowComment === 1 ?
                      <Grid item xs={12} className={classes.qCommentGrid}>
                        <div className={classes.qCommentLabel}>{pQuestion.cText}</div>
                        <TextField
                            label=""
                            id="outlined-size-small"
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            value={usrComment === null ? "" : usrComment}
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
                      <div className={classes.qCommentLabel}><i><b>Manual Comment</b></i>: {usrComment}</div>
                    </Grid>
                    : null
                  : null
                }
                <Grid item xs={2}>
                    {submitted === 0 ?
                      <div className="ad-padding-t-40">
                        <SubmitButton variant="contained" disabled={ADCache.disableSubmit} color="primary" className={classes.submitButton} onClick={handleSubmit}>
                          Submit
                        </SubmitButton> 
                      </div>
                    : 
                      <div className={classes.respDateTime}>{respInitials + ' ' + respDT}</div>
                    }
                </Grid>
            </Grid>
        </div>
    );
}
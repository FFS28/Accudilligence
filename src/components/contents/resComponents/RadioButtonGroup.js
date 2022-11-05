// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
        flexGrow: 1
    },
    qContent: {
      marginBottom: theme.spacing(1),
      display: 'block'
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
        fontStyle: 'italic',
        marginTop: 5
    },
    submitButton: {
      color: '#fff',
      position: 'absolute',
      bottom: 5,
      left: 30
    },
    radioButton: {
      marginRight: 2
    },
    qRadioCtrl: {
      marginRight: 2
    },
    qRadioFont: {
      fontFamily:'"Open Sans Light", "Roboto Condensed", "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue"',
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize:'0.8em',
      color: '#5c5c5c',
      marginLeft: 25
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

export default function RadioButtonGroup(props) {
  const classes = useStyles();
  const dispatch =  useDispatch();

  const { pQuestion, declinedPanel, pQkey } = props;

  const [pickList, setPickList] = useState([]);
  const [respData, setRespData] = useState('');
  const [selectedValue, setSelectedValue] = useState([]);
  const [usrComment, setUsrComment] = useState('');
  const [submitted, setSubmitted] = useState(0);
  const [respInitials, setRespInitials] = useState('');
  const [respDT, setRespDT] = useState('');
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    setSubmitted(pQuestion.submitted);
    setUsrComment(pQuestion.usrComment);
    setRespInitials(pQuestion.respInitials);
    setRespDT(pQuestion.respDT);
    setRespData(pQuestion.respData);
    setDeclined(declinedPanel);
  }, [declinedPanel, pQuestion.respDT, pQuestion.respInitials, pQuestion.respData, pQuestion.submitted, pQuestion.usrComment])

  useEffect(() => {
        if (pQuestion.pickList !== null) {
      setPickList(pQuestion.pickList);
    }
    if (pQuestion.respData) {
      setRespData(pQuestion.respData)
    }
  }, [pQuestion.pickList, pQuestion.respData])

  const handleChange = item => (event) => {
    setSelectedValue(item);
  };

  const handleChangeComment = (e) => {
    setUsrComment(e.target.value);
  }

  let userID = Auth.userPool.getCurrentUser().username;
  let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
  function questionSubmit()
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
            response: !declined ? selectedValue.id : null,
            usrComment: usrComment,
            hiddenComment: selectedValue.title
          }
        }
        //console.log(payLoad)
        API.post('postresponses', '/', payLoad ).then(response => {
          // console.log("PostDPR Radio Response:"+JSON.stringify(response));
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
                  ADCache.selectTooltip = true;
                  dispatch(RefreshAreaList(Date.now()));
                } else if (resBody[i].SPECIAL_ACTION === "Finished") {
                  console.log("NEED TO SUPPORT FINISH WITH RESPONSES")
                }
              } else if (resBody[i].hasOwnProperty('FollowUp')) {
                //console.log(resBody[i]);
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
    if (selectedValue.length !== 0) {
      ADCache.disableSubmit = true;
      questionSubmit();
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
          // console.log(response.body);
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
          <Grid container spacing={1}>
            <Grid item md={12} className={classes.qContent}>
              {submitted === 0 ? 
                !declined ?
                    <FormControl component="fieldset">
                      {(pickList.length < 4) ?
                        <RadioGroup row aria-label="position" name="position" defaultValue="top" >
                            {pickList.map((item, key) => (
                                <FormControlLabel className={classes.qRadioCtrl}
                                  value={item.title} 
                                  disabled={item.enabled ? false: true} 
                                  control={<Radio color="default" className={classes.qRadioFont}/>} 
                                  label={item.title} key={key}
                                  onChange={handleChange(item)}/>
                            ))}
                        </RadioGroup>
                      :
                        <RadioGroup aria-label="position" name="position" defaultValue="top" >
                          {pickList.map((item, key) => (
                              <FormControlLabel className={classes.qRadioFont}
                                value={item.title} 
                                disabled={item.enabled ? false: true} 
                                control={<Radio color="default" className={classes.qRadioFont} />} 
                                label={item.title} key={key}
                                onChange={handleChange(item)}/>
                          ))}
                        </RadioGroup>
                      }
                    </FormControl>
                  : null
                : !declined ?
                  (respData != null) ?
                    <FormControl component="fieldset">
                      <RadioGroup row aria-label="position" name="position" defaultValue="top">
                        <FormControlLabel className={classes.qRadioFont}
                          value={respData}
                          disabled
                          control={<Radio color="default" checked/>} 
                          label={respData}/>
                      </RadioGroup>
                    </FormControl>
                  : null
                : null
              }
            </Grid>
            {submitted === 0 ?
                !declined 
                  ?
                    <div>
                      { pQuestion.AllowComment === 1 ?
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
                :null
            }
            <Grid item xs={2}>
                {submitted === 0 ?
                  (selectedValue.length !== 0) ?
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
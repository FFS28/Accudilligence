// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
//import classNames from 'classnames';
import { green } from '@material-ui/core/colors';
import { Auth, API } from 'aws-amplify';
import { SubmitQuestionResponse, SubmitFollowUpQuestions } from '../../../store/modules/questionRedux';
//import { ADCache, AUTO_SELECT, MANUAL_SELECT } from '../../../store/ADCache';
//import { RefreshAreaList, RefreshTopicList } from '../../../store/modules/projectRedux';

const useStyles = makeStyles((theme) => ({
    root: {
        margin:'10px 0 0 20px'
    },
    qContent: {
      marginBottom: theme.spacing(1)
    },
    submitButton: {
      color: '#fff',
      position: 'absolute',
      bottom: 0,
      right: 1
    },
    leftLabel: {
      fontSize: 17,
      marginRight: 3
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
    respDateTime: {
      color: '#7d7d7d',
      position: 'absolute',
      bottom: -5,
      right: 5,
      fontStyle: 'italic'
    }
}));

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

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

export default function SwitchButton(props) {
    const classes = useStyles();
    const dispatch =  useDispatch();

    const { pQuestion, declinedPanel, pQkey } = props;

    const [checked, setChecked] = useState(1);
    const [submitted, setSubmitted] = useState(0);
    const [usrComment, setUsrComment] = useState('');
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
    }, [declinedPanel, pQuestion.respDT, pQuestion.respData, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment]);

    const handleCheck = (e) => {
        setChecked(e.target.checked);
        e.target.checked ? setChecked(1) : setChecked(0);
    };

    const handleChange = (e) => {
      setUsrComment(e.target.value);
    }

    let userID = Auth.userPool.getCurrentUser().username;
    let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
    function switchSubmit()
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
              isOptOut: declinedPanel ? 1 : 0,
              respType: pQuestion.RespType,
              response: !declined ? checked : null,
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

              if (resBody[1]) {
                getFollowUpQuestions(resBody[1]);
              }
            }
            else {
              console.log("Error: Unexpected response from server");
              console.log(response.body);
            }
          }).catch(error => {
            console.log("Error: Unexpected server error posting your anwser.");
            console.log(error);
          });
        }
      }


    const handleSubmit = () => {
      switchSubmit();
    }

    const getFollowUpQuestions = (submittedResponse) => {
      const resLen = submittedResponse.length;
      
      for (let i = 0; i < resLen; i ++) {
        const followUp = submittedResponse[i].FollowUp;
        const areaID = followUp.AID;
        //console.log(followUp);

        if (areaID === 'TA') {
          requestFollowUpQuestions(followUp);
        } else if (areaID === 'DO') {

        } else if (areaID === 'OR') {

        } else {

        }
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
            //console.log(response.body);
            // bind submit status to questionRedux
            dispatch(SubmitFollowUpQuestions(response.body, pQkey));
          }
          else {
            console.log(response.body);
          }
        }).catch(error => {
          console.log("Error: Unexpected system error retrieving questions from server.");
          console.log(error);
        });
      }
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={10} className={classes.qContent}>
                  {submitted === 0 ?
                    !declined ?
                      <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item className={classes.leftLabel}>No</Grid>
                        <Grid item>
                          <FormControlLabel
                            control={<IOSSwitch checked={checked === 1 ? true : false} onChange={handleCheck} />}
                            label="Yes"
                          />
                        </Grid>
                      </Grid> 
                    : null
                  :
                    !declined ?
                      <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item className={classes.leftLabel}>No</Grid>
                        <Grid item>
                          <FormControlLabel
                            control={<IOSSwitch checked={ respData === 1 ? true : false } 
                            disabled
                            />}
                            label="Yes"
                          />
                        </Grid>
                      </Grid> 
                    : null
                  }
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={10} className={classes.qCommentGrid}>
                  {submitted === 0 ?
                    !declined ?
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
                            name="comment"
                            onChange={handleChange}
                            />
                        <Typography className={classes.qCommentDescribe}>
                            {pQuestion.hText}
                        </Typography>
                        </>
                      : null
                    : null
                  :
                    !declined ?
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
                          </SubmitButton> 
                      :
                        <Typography className={classes.respDateTime}>
                          {respInitials + ' ' + respDT}
                        </Typography>
                    }
                </Grid>
            </Grid>
        </div>
    );
}
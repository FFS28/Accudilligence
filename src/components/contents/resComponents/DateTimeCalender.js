// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { Auth, API } from 'aws-amplify';
import TextField from '@material-ui/core/TextField';

// calender module
//import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
  //DatePicker,
  //TimePicker
} from '@material-ui/pickers';

import { SubmitQuestionResponse, SubmitFollowUpQuestions } from '../../../store/modules/questionRedux';
////import { ADCache, AUTO_SELECT, MANUAL_SELECT } from '../../../store/ADCache';
//import { RefreshAreaList, RefreshTopicList } from '../../../store/modules/projectRedux';

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
      color: '#7d7d7d',
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

export default function DateTimeCalendar(props) {
    const classes = useStyles();
    const dispatch =  useDispatch();

    const { pQuestion, declinedPanel, pQkey } = props;

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    //const [selectedEndDate, setSelectedEndDate] = React.useState(new Date('2014-08-18T21:11:54'));
    const [setSelectedEndDate] = React.useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [usrComment, setUsrComment] = useState('');
    const [submitted, setSubmitted] = useState(0);
    const [respInitials, setRespInitials] = useState('');
    const [respDT, setRespDT] = useState('');
    const [respData, setRespData] = useState('');
    const [declined, setDeclined] = useState(false);


    useEffect(() => {
        console.log(pQuestion);
        setSubmitted(pQuestion.submitted);
        setUsrComment(pQuestion.usrComment);
        setRespInitials(pQuestion.respInitials);
        setRespDT(pQuestion.respDT);
        setRespData(pQuestion.respData);
        setDeclined(declinedPanel);
    }, [declinedPanel, pQuestion.RespType, pQuestion.respDT, pQuestion.respData, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment]);

    const handleDateChange = (type) => (chooseVal) => {
        console.log(type);
        console.log(chooseVal);
    }
    
    const handleDateFnsDateChange = (type) => (chooseVal) => {
        const year = chooseVal.getFullYear();
        const month = chooseVal.getMonth() > 9 ? (chooseVal.getMonth() + 1) : '0' + (chooseVal.getMonth() + 1);
        const date = chooseVal.getDate() > 9 ? chooseVal.getDate() : '0' + chooseVal.getDate();
        const hour = chooseVal.getHours() > 9 ? chooseVal.getHours() : '0' + chooseVal.getHours();
        const minute = chooseVal.getMinutes() > 9 ? chooseVal.getMinutes() : '0' + chooseVal.getMinutes();
        const second = chooseVal.getSeconds() > 9 ? chooseVal.getSeconds() : '0' + chooseVal.getSeconds();    

        const selectDate = year + '-' + month + '-' + date;
        const selectTime = hour + ':' + minute + ':' + second;
        
        type === 'start' ? setSelectedDate(selectDate + 'T' + selectTime): setSelectedEndDate(selectDate + 'T' + selectTime);
        // console.log(selectDate + 'T' + selectTime);
        if (pQuestion.RespType === 'DA') {
            type === 'start' ? setStartDate(selectDate) : setEndDate(selectDate);
        } else if (pQuestion.RespType === 'DT') {
            type === 'start' ? setStartDate(selectDate) : setEndDate(selectTime);
        } else {
            type === 'start' ? setStartDate(selectTime) : setEndDate(selectTime);
        }  
    };

    const handleChangeComment = (e) => {
        setUsrComment(e.target.value);
    }

    let userID = Auth.userPool.getCurrentUser().username;
    let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
    function dateTimeSubmit()
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
              response: !declined ? startDate + 'T' + endDate : null,
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
                // console.log(resBody[0].respInitials + ' : ' + resBody[0].respDT);
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
            console.log(response.body);
            }
        }).catch(error => {
            console.log("API Error: PostDPQ RBG", error);
          });
      }
    }
                

    const handleSubmit = () => {
        dateTimeSubmit();
    }

    const getFollowUpQuestions = (submittedResponse) => {
      const resLen = submittedResponse.length;
      
      for (let i = 0; i < resLen; i ++) {
        const followUp = submittedResponse[i].FollowUp;
        const areaID = followUp.AID;
        console.log(followUp);

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
                    console.log(response.body);
                    // bind submit status to questionRedux
                    dispatch(SubmitFollowUpQuestions(response.body, pQkey));
                }
                else {
                    console.log(response.body);
                }
            }).catch(error => {
                console.log("API Error: GetFUDPQ", error);
            });
        }
    }

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={10} className={classes.qContent}>
                    {submitted === 0 ?
                        !declined ?
                            pQuestion.RespType === 'DA' ?
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="start"
                                            label="Date"
                                            format='MM/dd/yyyy'
                                            value={startDate}
                                            onChange={handleDateChange('start')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            />
                                    </Grid>
                                </MuiPickersUtilsProvider> 
                            : pQuestion.RespType === 'DT' ?
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="start"
                                            label="Date"
                                            format='MM/dd/yyyy'
                                            value={selectedDate}
                                            onChange={handleDateChange('start')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            />
                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="end"
                                            label="Time"
                                            value={selectedDate}
                                            onChange={handleDateChange('end')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                            />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            :  
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="start"
                                        label="Time"
                                        value={selectedDate}
                                        onChange={handleDateChange('start')}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                        />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        : null
                    :   !declined ? 
                            (respData != null) ?
                                <TextField
                                    label="DateTime"
                                    id="input"
                                    value={respData}
                                    variant="outlined"
                                    size="small"
                                    disabled
                                    />
                            :null
                        :null 
                    }
                </Grid>
                <Grid item xs={2}>
                </Grid>
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
                                    onChange={handleChangeComment}
                                    />
                                <Typography className={classes.qCommentDescribe}>
                                    {pQuestion.hText}
                                </Typography>
                                </>
                            :null
                        :null
                    :   !declined ?
                            usrComment ? 
                                <Typography className={classes.qCommentLabel}>
                                    Additional Comment : {pQuestion.usrComment}
                                </Typography>
                            :null
                        :null
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
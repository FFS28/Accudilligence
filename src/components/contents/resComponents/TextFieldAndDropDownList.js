// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
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
    qCommentGrid: {
      marginBottom: theme.spacing(4)
    },
    qCommentLabel: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 'bold',
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
    margin: {
      margin: theme.spacing(1),
    },
    commentArea: {
        marginTop: 10
    },
    respDateTime: {
      color: '#7d7d7d',
      position: 'absolute',
      bottom: -5,
      right: 5,
      fontStyle: 'italic'
    }
}));



const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Helvetica Neue"',
      'Arial'
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

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

export default function TextFieldAndDropDownList(props) {
    const classes = useStyles();
    const dispatch =  useDispatch();

    const { pQuestion, declinedPanel, pQkey } = props;

    const [pickList, setPickList] = useState([]);
    const [selectItem, setSelectItem] = useState('');
    const [inputVal, setInputVal] = useState('');
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
      if (pQuestion.pickList !== null) {
        setPickList(pQuestion.pickList);
      }
    }, [declinedPanel, pQuestion.pickList, pQuestion.respDT, pQuestion.respData, pQuestion.respInitials, pQuestion.submitted, pQuestion.usrComment])

    const handleChangeInput = (e) => {
      setInputVal(e.target.value);
    }

    const handleChangeComment = (e) => {
      setUsrComment(e.target.value);
    }

    const handleChangeSelect = (e) => {
      //console.log(e.target.value);
      setSelectItem(e.target.value);
    };

    let userID = Auth.userPool.getCurrentUser().username;
    let userJWT = (Auth.user.jwt) ? Auth.user.jwt : props.jwt;
    function txtdropdownSubmit()
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
              isOptOut: declined ? 1 : 0,
              respType: pQuestion.RespType,
              response: {"response": inputVal, "pickValue": selectItem.id },
              usrComment: usrComment,
              hiddenComment: selectItem.title
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
              console.log("Error: Unexpected server response posting your answer")
              console.log(response.body);
            }
          }).catch(error => {
            console.log("Error: Unexpected error posting your response")
            console.log(error);
          });
        }
    }

    const handleSubmit = () => {
      txtdropdownSubmit();
    }



    const getFollowUpQuestions = (submittedResponse) => {
      const resLen = submittedResponse.length;
      
      for (let i = 0; i < resLen; i ++) {
        const followUp = submittedResponse[i].FollowUp;
        const areaID = followUp.AID;
        // console.log(followUp);

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
            // console.log(response.body);
            // bind submit status to questionRedux
            dispatch(SubmitFollowUpQuestions(response.body, pQkey));
          }
          else {
            console.log("Unexpected response from server retrieving questions")
            //console.log(response.body);
          }
        }).catch(error => {
          console.log("Error: Unexpected error getting questions from project.")
          console.log(error);
        });
      }
    }

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={10} className={classes.qContent}>
                  {submitted === 0 ?
                    !declined ?
                      <>
                      <FormControl className={classes.margin}>
                        <BootstrapInput id="input" onChange={handleChangeInput}/>
                      </FormControl>
                      <FormControl className={classes.margin}>
                        <Select
                          labelId=""
                          id="select"
                          value={selectItem}
                          onChange={handleChangeSelect}
                          input={<BootstrapInput />}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {pickList.map((item, key) => (
                              <MenuItem value={item} key={key} disabled={item.enable}>{item.title}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      </> 
                    : null
                  : !declined ? 
                      (respData != null) ?
                        <FormControl className={classes.margin}>
                          <BootstrapInput id="input" value={respData} disabled/>
                        </FormControl>
                      : null
                    : null
                  }
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={10} className={classes.qCommentGrid}>
                  {submitted === 0 ?
                    !declined ?
                      pQuestion.AllowComment === 1 ?
                        <div className={classes.commentArea}>
                          <Typography className={classes.qCommentLabel}>
                              {pQuestion.cText}
                          </Typography>
                          <TextField
                              label="Comment"
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
                        </div>
                      :null
                    :null
                  :
                    !declined ?
                      usrComment ? 
                        <Typography className={classes.qCommentLabel}>
                            Additional Comment : {usrComment}
                        </Typography>
                      : null
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
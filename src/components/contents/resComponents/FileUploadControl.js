import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
//import { DropzoneArea } from 'material-ui-dropzone'
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

export default function FileUploadComponent(props) {
    const classes = useStyles();
    const dispatch =  useDispatch();

    const { pQuestion, declinedPanel, pQkey } = props;

    const [files, setFiles] = useState('');
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

    const handleChangeUpload = (e) => {
        let file = e.target.files;
        let reader = new FileReader();
        if (pQuestion.RespType === 'UR') {
            setFiles(file.name)
        } else {
            reader.readAsDataURL(file[0]);
            reader.onload = (e) => {
                setFiles(e.target.result);
            }
        }
        console.log(file);
    }

    const handleChangeComment = (e) => {
        setUsrComment(e.target.value);
    }
    let userID = Auth.userPool.getCurrentUser().username;
    function fileSubmit()
    {
      if (userID) {
          let payLoad = {
            headers: {
              Authorization: Auth.user.jwt
            },
            body: {
              projectID: pQuestion.ProjectID,
              AID: pQuestion.AID,
              TID: pQuestion.TID,
              DPID: pQuestion.DPID,
              QID: pQuestion.QID,
              isOptOut: declined ? 1 : 0,
              respType: pQuestion.RespType,
              response: !declined ? files : null,
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
              setFiles('');

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
      fileSubmit();
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
            Authorization: Auth.user.jwt
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
                    // !declined ? <DropzoneArea showFileNames showAlerts={false} filesLimit={1} onChange={handleChangeUpload} /> : null
                    !declined ? 
                      <input type='file' name='file' onChange={handleChangeUpload} />
                    : null
                  : !declined ? 
                      (respData != null) ?
                        <TextField
                            value={respData}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            disabled
                            />
                      : null   
                    : null
                  }
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={10} className={classes.qCommentGrid}>
                  {submitted === 0 ?
                    !declined ?
                      pQuestion.AllowComment === 1 ?
                        <div className={classes.commentArea}>
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
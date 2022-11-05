// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//
import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch} from 'react-redux';
import { SelectProject } from '../../store/modules/projectRedux';
import { activateProject, activateArea, cancelDialog } from '../../store/modules/dialogRedux';
import { ADCache, AUTO_SELECT } from '../../store/ADCache';
import { Auth, API } from 'aws-amplify';


function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

export default function FormDialog(props) {

  // setOpen(openDialog);
  const {type, openDialog, projectID, areaID} = props;

  const [signatory, setSignatory] = useState('');
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openAreaDialog, setOpenAreaDialog] = useState(false);

  let projectList = ADCache.ProjectList;
  
  useEffect(() => {
    // console.log(type, openDialog);
    if (type === 'project') {
        setOpenProjectDialog(openDialog)
    } else {
        setOpenAreaDialog(openDialog)
    }
  }, [openDialog, type]);

  const dispatch = useDispatch();

  const handleSignatory = (e) => {
    // console.log(e.target.value);
    setSignatory(e.target.value);
  }


  function postSubmitArea()
  {
    let payLoad = {
      headers: {
        Authorization: props.jwt
      },
      body: { 
        regUsr: Auth.userPool.getCurrentUser().username,
        projectID: projectID,
        AID: areaID,
        eSignatory: signatory
      }
    }

    //console.log("Activate Area Payload:"+JSON.stringify(payLoad))
    API.post('adactivateprojectarea', '/', payLoad ).then(response => {
      //console.log("ActivateArea response:" + JSON.stringify(response));
      if (response.statusCode===200)
        setResponseStatus(response);
      }).catch(error => { 
        if (error.message.includes("401")) {
          signOut();
        } else {
          console.log("Error: Unexpected error activating area.")
          console.log(error)
        }
    });
  }

  function postSubmitProject()
  {
    let payLoad = {
      headers: {
        Authorization: props.jwt
      },
      body: { 
        projectID: projectID,
        eSignatory: signatory
      }
    }
    //console.log(payLoad)
    API.post('activateprojectbytarget', '/', payLoad ).then(response => {
      //console.log("ActivateProject response:" + JSON.stringify(response));
      if (response.statusCode===200) {
        ADCache.AreaList       = {};
        ADCache.TopicList      = {};
        ADCache.SubTopicList   = {};
        ADCache.QuestionKey    = {};
        ADCache.ResetAreas     = false;
        ADCache.ResetTopics    = false;
        ADCache.ResetSubTopics = false;
        ADCache.selectionType  = AUTO_SELECT; // FORCE AUTO SELECT ON NEW PROJECT SELECTION AS ALL CACHES ARE FLUSHED

        if (ADCache.ProjectList != null) {

          projectList = ADCache.ProjectList[Auth.userPool.getCurrentUser().username]

          if (projectList.length === 1) {
            projectList[0].hasAgreedToTerms = true;
          } else {
            for (let i2 = 0 ; i2 < projectList.length; i2++) {
              if (projectList[i2].ProjectID === projectID) {
                projectList[i2].hasAgreedToTerms = true;
                break;
              }
            }
          }
        }
        dispatch(SelectProject(projectID));  
        setResponseStatus(response);
      }
    }).catch(error => { 
      if (error.message.includes("401")) {
        window.location.reload(true);
        //signOut();
      } else {
        console.log("Error: Unexpected error in activating project.")
        console.log(error)
      }
    });
  }

  const handleSubmit = () => {
    if(signatory.length > 0) {
      if (type === 'project')
        postSubmitProject();
      else 
        postSubmitArea();
    }
  }
  
  const onCloseDialog = () => {
    dispatch(cancelDialog(false));
    setOpenProjectDialog(false);
    setOpenAreaDialog(false);
  }

  function setResponseStatus(response, pid, aid) {
    const statusCode = response.statusCode;
    const statusError = response.errorMessage;
    
    type === 'project' ? dispatch(activateProject(pid, statusCode)) : dispatch(activateArea(aid, statusCode));
  }

  return (
    <div>
      <Dialog fullWidth={true} maxWidth = {'md'} open={type === 'project' ? openProjectDialog : openAreaDialog} onClose={onCloseDialog} aria-labelledby="I have read and agreed to terms and conditions of use">
        <DialogContent>
          <table width="900px">
            <tbody>
                <tr>
                    <td width="345px">
                      <div className="scrollBoxActivateProject goldTrim">
                        AccuDiligence takes security and data privacy seriously and minimizes the use and storage of any sensitive
                        identifiable information at all times.<br/><br/>
                        By digitally signing below, I agree to AccuDiligence's Terms &amp;
                        Conditions of Use, Private Policy, and Cookie Policy.
                      </div>
                    </td>
                    <td className="GeneralInstructions">
                        <p className="L3Heading">GENERAL INSTRUCTIONS:</p>
                        <ul>
                            <li>This interview process is similar to a chat where your responses will drive the direction of conversation.</li>
                            <li>Your responses are considered <span className="underlineMe">evidentiary data or attestations of facts</span> regarding the system in scope.</li>
                            <li>If you're not sure which system is in scope, please contact the project owner to clarify.</li>
                            <li>This interface is designed currently for desktop viewing only. Key navigation functionality may be obscured on a small mobile screen.</li>
                            <li>For open-ended text responses, reviews may trigger follow-up questions after the submission. Timing depends on availability of reviewers.</li>
                            <li>When the system has completed the interviews for a given section, the progress indicators will turn dark to signal completion.</li>
                            <li><b>ALL SPECIFIC INTERVIEW QUESTIONS MUST HAVE A SUBMITTED RESPONSE IN ORDER TO BE MARKED AS COMPLETED.</b></li>
                            <li><span className="warningTerm"><b>PLEASE NOTE: ONCE YOU SUBMIT A RESPONSE, <span className="underlineMe">IT CANNOT BE ALTERED OR MODIFIED</span></b>.</span></li>
                        </ul>
                    </td>
                </tr>
            </tbody>
          </table>    
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="signatory"
            label="Please type your name to digitally sign and accept the terms and conditions."
            type="text"
            fullWidth
            onChange={handleSignatory}
          />
        </DialogContent>
        <DialogActions>
            <Button onClick={onCloseDialog} variant="contained" color="secondary">
                Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={signatory.length > 0 ? false : true}>
                Submit
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

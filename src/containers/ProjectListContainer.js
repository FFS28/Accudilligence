// Copyright (c) 2021. All Rights Reserved. AccuDiligence, LLC
// USER TERMS AND CONDITIONS PROHIBITS REVERSE ENGINEERING OF ANY ACCUDILIGENCE CODE.
//

/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Auth, API } from 'aws-amplify';
//import { SelectProject, RefreshSidebar, SetSelectIsManual  } from '../store/modules/projectRedux';
import { SelectProject } from '../store/modules/projectRedux';
import ProjectList from '../components/sidebar/projectList/ProjectList';
import { ADCache, AUTO_SELECT } from '../store/ADCache';

function signOut() {
  //Auth.signOut();
  //Check environment variable for release
  //let domainStr = "localhost:3000/"
  //window.location.href = domainStr + "?signin=1";
  //window.location.reload();
}

//20200904 T. Jannak
//Loads all projects for user. No UI to reload after login, but a useEffect is available for resetProjectList
//
function ProjectListContainer(props) {
  const { jwt, setPBV, setPBB, rt, ra, frt, fra } = props;

  // Project Redux
  const refreshSidebar = useSelector(state => state.projectRedux.refreshSidebar);
  const dispatch       = useDispatch();

  const [projectsLoaded, SetProjectsLoaded] = useState(false);

  var userID = Auth.userPool.getCurrentUser().username;
  var userJWT = (Auth.user.jwt) ? Auth.user.jwt : jwt;

  function fetchProjs()
  {
    if (userID) {
      let key = userID;
      if (ADCache.ProjectList.hasOwnProperty(key)) {
        //Helps to debounce server calls here from multiple React renders
        return;
      } else { // in this case if userID <> cache, let it fall through to rerender
        // Key not yet set, set that to prevent second server call on Dev React, but let it fall through
        ADCache.ProjectList[key] = null
      }

    let payLoad = {
      headers: {
        Authorization: userJWT
      },
      body: {

      }
    }

    API.post('gettargetprojects', '/', payLoad ).then(response => {
        //console.log("Get Target Project");
        //console.log(payLoad);
        //console.log(Auth.userPool.getCurrentUser());

        ADCache.ProjectList[key] = response.body;
        SetProjectsLoaded(true); // Force a rerender in React using a local state variable

        // Primary case, if user only has only a single project and it is ACTIVATED, then auto-select to first open question
        if (ADCache.ProjectList[key].length === 1) {
          let aProj = ADCache.ProjectList[key][0];
          ADCache.selectionType = AUTO_SELECT;
          dispatch(SelectProject(aProj["ProjectID"]));
        }
        if (ADCache.ProjectList[key].length === 0) {
          // No projects with valid TargetUsr. Either projects are closed or not yet paid and available. Show alart and let that person log out
          alert("Sorry, no active projects for your review at this time. Please contact support@accudiligenc.com if you need further assistance.");
        }
      }).catch(error => { 
        if (error.message.includes("401")) {
          window.location.reload(true);
          //signOut();
        } else {
          console.log("ERROR: An unexpected error occurred when retrieving your projects.");
          console.log(error);
        }
    });
    }
  }

  useEffect(() => {
      //console.log("userEffect(ProjectListContainer)...");
      fetchProjs();
  }, [refreshSidebar]);

  return (
    <ProjectList jwt={jwt} setPBV={setPBV} setPBB={setPBB} rt={rt} ra={ra} frt={frt} fra={fra} />
  );
}

export default ProjectListContainer;
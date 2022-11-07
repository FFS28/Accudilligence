const SAVE_PORJECT = 'ProjectList/SAVE_PORJECT';
const GET_SELECTED_PROJECT = 'ProjectList/GET_SELECTED_PROJECT';

export const saveProject = (projectList) => ({
  type: SAVE_PORJECT,
  projectList
});

export const getSelectedProject = (selectedProject) => ({
  type: GET_SELECTED_PROJECT,
  selectedProject : selectedProject
});

const initialState = {
  projectList: [],
  selectedProject: null
};

export default function projectRedux(state = initialState, action) {
  switch (action.type) {
    case SAVE_PORJECT:
      // console.log("Project Redux : " + action.project['ProjectID']);
      // return state.concat(action.project);
      return {
        ...state,
        project: action.projectList
      }
    case GET_SELECTED_PROJECT:
      // console.log("selected Project : " + action.selectedProject);
      return {
        ...state,
        selectedProject: action.selectedProject
      }
    default:
      return state;
  }
}

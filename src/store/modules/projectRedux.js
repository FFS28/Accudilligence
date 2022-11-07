
const REFRESH_AREALIST = 'AreaList/REFRESH_AREALIST';
const REFRESH_TOPICLIST = 'TopicList/REFRESH_TOPICLIST';

const SELECTED_PROJECT = 'ProjectList/GET_SELECTED_PROJECT';
const SELECTED_AREA = 'AreaList/GET_SELECTED_AREA';
const SELECTED_AREA_TOPIC = 'AreaList/GET_SELECTED_AREA_TOPIC';
const SELECTED_TOPIC = 'TopicList/GET_SELECTED_TOPIC';
const SELECTED_SUBTOPIC = 'SubTopicList/GET_SELECTED_SUBTOPIC';

export const RefreshAreaList = (refreshAreaList) => ({
  type: REFRESH_AREALIST,
  refreshAreaList: refreshAreaList
});

export const RefreshTopicList = (refreshTopicList) => ({
  type: REFRESH_TOPICLIST,
  refreshTopicList: refreshTopicList
});

export const SelectProject = (selectedProject) => ({
  type: SELECTED_PROJECT,
  selectedProject: selectedProject
});

export const SelectArea = (selectedArea) => ({
  type: SELECTED_AREA,
  selectedArea: selectedArea
});

export const SelectTopic = (selectedTopic) => ({
  type: SELECTED_TOPIC,
  selectedTopic: selectedTopic
});

/* topic value collisions
   area may change, topic stays the same
   this busts the deps for the useEffect hook in Topics
*/
export const SelectAreaTopic = (area, selectedTopic) => ({
  type: SELECTED_AREA_TOPIC,
  selectedAreaTopic: `${area}-${selectedTopic}`,
  selectedTopic: selectedTopic
});

export const SelectSubTopic = (selectedSubTopic) => ({
  type: SELECTED_SUBTOPIC,
  selectedSubTopic: selectedSubTopic
});

const initialState = {
  refreshAreaList: false, // Trigger for refresh via useEffect in SideBar, Top down render PRoject-Area-Topic-Subtopic
  refreshTopicList: false,

  selectedProject: null,
  selectedArea: null,
  selectedTopic: null,
  selectedSubTopic: null,
  selectedAreaSubTopic: null
};

export default function projectRedux(state = initialState, action) {
  switch (action.type) {
    case REFRESH_AREALIST:
      //console.log("Dispatch: Refresh Area List: " + action.refreshAreaList);
      return {
        ...state,
        refreshAreaList: action.refreshAreaList
      }

    case REFRESH_TOPICLIST:
      //console.log("Dispatch: Refresh Topic List: " + action.refreshTopicList);
      return {
        ...state,
        refreshTopicList: action.refreshTopicList
      }

    case SELECTED_PROJECT:
      //console.log("Dispatch: Selected Project: " + action.selectedProject);
      return {
        ...state,
        selectedProject: action.selectedProject
      }

    case SELECTED_AREA:
      //console.log("Dispatch: Selected Area: " + action.selectedArea);
      return {
        ...state,
        selectedArea: action.selectedArea
      }

    case SELECTED_TOPIC:
      //console.log("Dispatch: Selected Topic: " + action.selectedTopic);
      return {
        ...state,
        selectedTopic: action.selectedTopic
      }

    case SELECTED_SUBTOPIC:
      //console.log("Dispatch: Selected SubTopic: " + action.selectedSubTopic);
      return {
        ...state,
        selectedSubTopic: action.selectedSubTopic
      }

    case SELECTED_AREA_TOPIC:
      const newState = {
        ...state,
        selectedAreaSubTopic: action.selectedAreaTopic,
        selectedTopic: action.selectedTopic
      }
      return newState;

    default:
      return state;
  }
}

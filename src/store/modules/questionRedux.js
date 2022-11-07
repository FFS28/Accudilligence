const GET_QUESTION = 'SubTopicList/GET_QUESTION';
const LOADING_QUESTION_PANEL = 'SubTopicList/LOADING_QUESTION';
const SUBMIT_QUESTION_RESPONSE = 'ResComponent/SUBMIT_RESPONSE';
const SUBMITTED_FOLLOW_UP_QUESTION = 'ResComponent/SUBMITTED_FOLLOW_UP_QUESTION';

export const GetQuestions = (questionList) => ({
  type: GET_QUESTION,
  questionList
});

export const RerenderingQuestionPanel = (loadingQuestionPanel) => ({
    type: LOADING_QUESTION_PANEL,
    loadingQuestionPanel: loadingQuestionPanel
});

export const SubmitQuestionResponse = (submitted, pQuestionkey) => ({
    type: SUBMIT_QUESTION_RESPONSE,
    submitted,
    pQuestionkey,
});

export const SubmitFollowUpQuestions = (followUpQuestions, submittedQuestionKey) => ({
    type: SUBMITTED_FOLLOW_UP_QUESTION,
    followUpQuestions,
    submittedQuestionKey,
}); 

const initialState = {
    questionList: [],
    loadingQuestionPanel: true, 
    submitted: 0,
    pQuestionkey: -1,
    followUpQuestions: [],
    submittedQuestionKey: -1
};

export default function questionRedux(state = initialState, action) {

  switch (action.type) {
    case GET_QUESTION:
        return {
            ...state,
            questionList: action.questionList
        }
    case LOADING_QUESTION_PANEL:
        return {
            ...state,
            loadingQuestionPanel: action.loadingQuestionPanel
        }
    case SUBMIT_QUESTION_RESPONSE:
        return {
            ...state,
            submitted: action.submitted,
            pQuestionkey: action.pQuestionkey
        }
    case SUBMITTED_FOLLOW_UP_QUESTION:
        return {
            ...state,
            followUpQuestions: action.followUpQuestions,
            submittedQuestionKey: action.submittedQuestionKey
        }    
    default:
      return state;
  }
}

import { combineReducers } from 'redux';
import projectRedux from './projectRedux';
import dialogRedux from './dialogRedux';
import questionRedux from './questionRedux';

const rootReducer = combineReducers({
  projectRedux,
  dialogRedux,
  questionRedux
});

export default rootReducer;

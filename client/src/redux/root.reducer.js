import { combineReducers } from 'redux';

import fileReducer from './files/file.reducer';

export default combineReducers({
  file: fileReducer
});

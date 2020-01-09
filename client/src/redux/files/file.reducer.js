import { FileActionTypes } from './file.types';

const INITIAL_STATE = {
  fileText: null,
  loading: true,
  fileError: null
};

const fileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FileActionTypes.SET_FILE:
      return {
        ...state,
        fileText: action.payload,
        loading: false,
        fileError: null
      };
    case FileActionTypes.REMOVE_FILE:
      return {
        ...state,
        fileText: null,
        loading: false,
        fileError: null
      };
    case FileActionTypes.FILE_ERROR:
      return {
        ...state,
        fileText: null,
        loading: false,
        fileError: action.payload
      };
    default:
      return state;
  }
};

export default fileReducer;

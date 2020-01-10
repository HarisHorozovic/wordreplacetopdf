import { FileActionTypes } from './file.types';

const INITIAL_STATE = {
  fileText: null,
  loading: true,
  fileError: null,
  download: null
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
    case FileActionTypes.DOWNLOAD_SUCCESFUL:
      return {
        ...state,
        loading: false,
        fileError: null,
        download: 'Download is succesfull'
      };
    default:
      return state;
  }
};

export default fileReducer;

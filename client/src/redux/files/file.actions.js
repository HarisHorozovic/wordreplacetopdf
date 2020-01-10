import axios from 'axios';

import { FileActionTypes } from './file.types';

const apiUrl = 'http://localhost:5000/api/v1/files';

// Axios route handlers
export const uploadFile = file => dispatch => {
  axios
    .post(`${apiUrl}/`, file, { withCredentials: true })
    .then(res => dispatch(setCurrentFile(res.data.text)))
    .catch(err => dispatch(setFileError(err.response.data)));
};

export const getFile = () => dispatch => {
  axios
    .get(`${apiUrl}/`, { withCredentials: true })
    .then(res => dispatch(setCurrentFile(res.data)))
    .catch(err => dispatch(setFileError(err.response.data)));
};

export const removeFile = () => dispatch => {
  axios
    .delete(`${apiUrl}/`, { withCredentials: true })
    .then(() => dispatch(removeCurrentFile()))
    .catch(err => dispatch(setFileError(err.response.data)));
};

export const replaceInFile = (forReplace, replaceWith) => dispatch => {
  axios
    .post(
      `${apiUrl}/text`,
      { forReplace, replaceWith },
      { withCredentials: true }
    )
    .then(res => dispatch(setCurrentFile(res.data)))
    .catch(err => dispatch(setFileError(err.response.data)));
};

export const downloadAsWord = () => dispatch => {
  axios
    .get(`${apiUrl}/word`, { withCredentials: true })
    .then(() => {
      window.open(`${apiUrl}/word`);
      dispatch(downloadSuccess());
    })
    .catch(err => dispatch(setFileError(err.response.data)));
};

export const downloadAsPDF = () => dispatch => {
  axios
    .get(`${apiUrl}/pdf`, { withCredentials: true })
    .then(() => {
      window.open(`${apiUrl}/pdf`);
      dispatch(downloadSuccess());
    })
    .catch(err => dispatch(setFileError(err.response.data)));
};

// State handling functions
const setCurrentFile = data => {
  return {
    type: FileActionTypes.SET_FILE,
    payload: data
  };
};

const removeCurrentFile = () => {
  return {
    type: FileActionTypes.REMOVE_FILE
  };
};

const downloadSuccess = () => {
  return {
    type: FileActionTypes.DOWNLOAD_SUCCESFUL
  };
};

const setFileError = data => {
  return {
    type: FileActionTypes.FILE_ERROR,
    payload: data
  };
};

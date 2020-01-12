import axios from 'axios';

import { FileActionTypes } from './file.types';

const apiUrl = '/api/v1/files';

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
    .get(`${apiUrl}/word`, { withCredentials: true, responseType: 'blob' })
    .then(res => {
      const data = new Blob([res.data]);
      if (typeof window.navigator.msSaveBlob === 'function') {
        window.navigator.msSaveBlob(data, 'fileFromConvApp.docx');

        dispatch(downloadSuccess());
      } else {
        const blob = data;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'fileFromConvApp.docx';
        document.body.appendChild(link);

        link.click();

        dispatch(downloadSuccess());
      }
    })
    .catch(err => dispatch(setFileError(err.response.data)));
};

export const downloadAsPDF = () => dispatch => {
  axios
    .get(`${apiUrl}/pdf`, { withCredentials: true, responseType: 'blob' })
    .then(res => {
      const data = new Blob([res.data]);
      console.log(data);
      if (typeof window.navigator.msSaveBlob === 'function') {
        window.navigator.msSaveBlob(data, 'fileFromConvApp.pdf');

        dispatch(downloadSuccess());
      } else {
        const blob = data;
        console.log('PDF Blob', blob);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'fileFromConvApp.pdf');
        document.body.appendChild(link);

        link.click();
        dispatch(downloadSuccess());
      }
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

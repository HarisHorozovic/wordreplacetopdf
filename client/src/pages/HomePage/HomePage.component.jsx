import React from 'react';
import { connect } from 'react-redux';

import './HomePage.styles.scss';

// Components
import { ToastsContainer, ToastsStore } from 'react-toasts';
import Highlighter from 'react-highlight-words';
import FormInput from '../../components/FormInput/FormInput.component';
import CustomButton from '../../components/CustomButton/CustomButton.component';

// Actions
import {
  uploadFile,
  getFile,
  replaceInFile,
  downloadAsWord,
  downloadAsPDF,
  removeFile
} from '../../redux/files/file.actions';

class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      fileForUpload: null,
      forReplace: '',
      replaceWith: ''
    };
  }

  componentDidMount() {
    if (!this.props.fileText) {
      this.props.getFile();
    }
  }

  componentDidUpdate() {
    // set up toasts for errors
    if (this.props.fileError) {
      this.props.fileError.status === 'fail'
        ? ToastsStore.info(this.props.fileError.message)
        : ToastsStore.error(this.props.fileError.message);
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  selectFile = e => {
    this.setState({ fileForUpload: e.target.files[0] });
  };

  replaceTextClient = () => {
    this.props.replaceInFile(this.state.forReplace, this.state.replaceWith);

    this.setState({ forReplace: '', replaceWith: '' });
  };

  uploadFileClient = () => {
    const data = new FormData();
    data.append('wordfile', this.state.fileForUpload);

    this.props.uploadFile(data);
  };

  render() {
    let text;
    if (this.props.fileText) {
      text = this.props.fileText.replace(
        /<\/p>|<\/strong>|<strong>|<\/a>|<a>|<\/tr>|<tr>|<\/td>|<td>|<table>|<\/table>|<ul>|<\/ul>|<\/li>|<li>/g,
        ''
      );
      text = text.split('<p>');
    }

    return (
      <div className='main-page'>
        <div className='sidebar'>
          <FormInput
            type='file'
            handleChange={this.selectFile}
            name='wordfile'
          ></FormInput>
          <CustomButton handleClick={this.uploadFileClient}>
            Upload File
          </CustomButton>
          <CustomButton handleClick={() => this.props.removeFile()}>
            Remove File
          </CustomButton>
          <FormInput
            label='Search Text'
            handleChange={this.handleChange}
            name='forReplace'
            value={this.state.forReplace}
          />
          <FormInput
            label='Replace With'
            name='replaceWith'
            handleChange={this.handleChange}
            value={this.state.replaceWith}
          />
          <CustomButton handleClick={this.replaceTextClient}>
            Replace
          </CustomButton>

          <div className='button-group-download'>
            <CustomButton handleClick={() => this.props.downloadAsWord()}>
              Save as Word Document
            </CustomButton>
            <CustomButton handleClick={() => this.props.downloadAsPDF()}>
              Save as PDF document
            </CustomButton>
          </div>
        </div>
        <div className='file-content'>
          {text ? (
            text.map((el, i) => (
              <p key={i}>
                <Highlighter
                  highlightClassName='YourHighlightClass'
                  searchWords={[this.state.forReplace]}
                  autoEscape={true}
                  textToHighlight={el}
                  caseSensitive
                />
              </p>
            ))
          ) : (
            <p>
              Upload file to continue, once you are done, click on remove file
            </p>
          )}
        </div>
        <ToastsContainer store={ToastsStore} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  uploadFile: file => dispatch(uploadFile(file)),
  getFile: () => dispatch(getFile()),
  replaceInFile: (forReplace, replaceWith) =>
    dispatch(replaceInFile(forReplace, replaceWith)),
  downloadAsWord: () => dispatch(downloadAsWord()),
  downloadAsPDF: () => dispatch(downloadAsPDF()),
  removeFile: () => dispatch(removeFile())
});

const mapStateToProps = ({ file: { fileText, fileError } }) => ({
  fileText,
  fileError
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

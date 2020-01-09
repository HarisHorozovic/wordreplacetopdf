import React from 'react';
import { connect } from 'react-redux';

import './HomePage.styles.scss';

// Components
import Highlighter from 'react-highlight-words';
import FormInput from '../../components/FormInput/FormInput.component';
import CustomButton from '../../components/CustomButton/CustomButton.component';

// Actions
import {
  uploadFile,
  getFile,
  replaceInFile
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
      text = this.props.fileText.replace(/<\/p>/g, '');
      text = this.props.fileText.replace(/<\/p>/g, '');
      text = text.replace(/<\/strong>/g, '');
      text = text.replace(/<strong>/g, '');
      text = text.replace(/<\/a>/g, '');
      text = text.replace(/<a>/g, '');

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
            <CustomButton>Save as Word Document</CustomButton>
            <CustomButton>Save as PDF document</CustomButton>
          </div>
        </div>
        <div className='file-content'>
          {text ? (
            text.map(el => (
              <p key={el}>
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
            <p>Upload file to continue</p>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  uploadFile: file => dispatch(uploadFile(file)),
  getFile: () => dispatch(getFile()),
  replaceInFile: (forReplace, replaceWith) =>
    dispatch(replaceInFile(forReplace, replaceWith))
});

const mapStateToProps = ({ file: { fileText } }) => ({
  fileText
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

import React from 'react';

import './HomePage.styles.scss';

// Components
import Highlighter from 'react-highlight-words';
import FormInput from '../../components/FormInput/FormInput.component';
import CustomButton from '../../components/CustomButton/CustomButton.component';

class HomePage extends React.Component {
  constructor() {
    super();

    this.state = {
      text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      search: '',
      replaceWith: ''
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className='main-page'>
        <div className='sidebar'>
          <FormInput
            label='Search Text'
            handleChange={this.handleChange}
            name='search'
            value={this.state.search}
          />
          <FormInput
            label='Replace With'
            name='replaceWith'
            handleChange={this.handleChange}
            value={this.state.replaceWith}
          />
          <CustomButton>Replace</CustomButton>

          <div className='button-group-download'>
            <CustomButton>Save as Word Document</CustomButton>
            <CustomButton>Save as PDF document</CustomButton>
          </div>
        </div>
        <div className='file-content'>
          <Highlighter
            highlightClassName='YourHighlightClass'
            searchWords={[this.state.search]}
            autoEscape={true}
            textToHighlight={this.state.text}
          />
          <p>{this.state.text}</p>
        </div>
      </div>
    );
  }
}

export default HomePage;

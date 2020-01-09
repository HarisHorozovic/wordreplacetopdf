import React from 'react';

import './CustomButton.styles.scss';

const CustomButton = ({ children, handleClick, ...otherProps }) => (
  <button className='custom-button' onClick={handleClick} {...otherProps}>
    {children}
  </button>
);

export default CustomButton;

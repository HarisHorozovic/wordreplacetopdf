import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

// Components
import HomePage from './pages/HomePage/HomePage.component';

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={HomePage} />
      </Switch>
    </div>
  );
}

export default App;

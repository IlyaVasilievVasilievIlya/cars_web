import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { navInfos } from './public/consts';

export const ThemeContext = React.createContext('tasks');

const App: React.FC = function () {

  const routes = navInfos.map(navInfo => <Route {...navInfo}/>)

  return (
    <div className="App">
      <Routes>
        {routes}
      </Routes>
    </div>
  );
}

export default App;
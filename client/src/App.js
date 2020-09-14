import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import BubblePage from './components/BubblePage';
import PrivateRoute from './components/PrivateRoute';
import "./styles.scss";

function App() {
  return (
    <Router>
      <div className="App">
      <nav>
        <Link to ='/'/>
        <Link to ='/bubblepage'/>
      </nav>
        <Route exact path="/" component={Login} />
        {/* 
          Build a PrivateRoute component that will 
          display BubblePage when you're authenticated 
        */}

        <PrivateRoute exact path = '/bubblepage'>
          <BubblePage/>
        </PrivateRoute>

      </div>
    </Router>
  );
}

export default App;

import React from "react";
import "./App.css";
import { Route, Link } from "react-router-dom";
import Home from "./components/Home";
import ResourceOverview from "./components/ResourceOverview";


function App() {
  // return  <ResourceDetails1/>
  // return <ResourceDetails1/>
  
  return (
    <div >
      <ul>
        <li>
          <Link to='/ResourceOverview/patient'>Patient</Link>
        </li>
        <li>
          <Link to='/ResourceOverview/encounter'>Encounter</Link>
        </li>
      </ul>
      <Route path="/" component={Home} exact={true} />
      <Route path="/ResourceOverview/:resource" component={ResourceOverview} />
    </div>
  );
}

export default App;

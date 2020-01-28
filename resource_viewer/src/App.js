import React from "react";
import "./App.css";
import { Route, Link } from "react-router-dom";
import Home from "./components/Home";
import ResourceInfo from "./components/ResourceInfo";


function App() {
  // return  <ResourceDetails1/>
  // return <ResourceDetails1/>
  return (
    <div >
      <ui>
        <li>
          <Link to='/ResourceInfo/patient'>Patient</Link>
        </li>
        <li>
          <Link to='/ResourceInfo/encounter'>Encounter</Link>
        </li>
      </ui>
      <Route path="/" component={Home} exact={true} />
      <Route path="/ResourceInfo/:resource" component={ResourceInfo} />
    </div>
  );
}

export default App;

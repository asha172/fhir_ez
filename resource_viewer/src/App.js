import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import TreeViewer from "./components/TreeViewer";
import Home from "./components/Home";
import ResourceDetails from "./components/ResourceDetails";

function App() {
  // return  <ResourceDetails1/>
  // return <ResourceDetails1/>
  return (
    <div>
      <Route path="/" component={Home} exact={true} />
      <Route path="/treeviewer" component={TreeViewer} />
      <Route path="/resourcedetails" component={ResourceDetails} />
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import TreeViewer from "./components/TreeViewer";
import Home from "./components/Home";


function App() {
  // return  <ResourceDetails1/>
  // return <ResourceDetails1/>
  return (
    <div >
      <Route path="/" component={Home} exact={true} />
      <Route path="/treeviewer" component={TreeViewer} />
      

    </div>
  );
}

export default App;

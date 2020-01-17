import React from "react";
import "./App.css";
import RouterJunction from "./components/Router";
import { Route } from "react-router-dom";
import TreeViewer from "./components/TreeViewer";

function App() {
  // return  <ResourceDetails1/>
  // return <ResourceDetails1/>
  return (
    <div>
      <Route path="/" compnent={TreeViewer} />
      <Route path="/treeviewer" compnent={TreeViewer} />
    </div>
  );
}

export default App;

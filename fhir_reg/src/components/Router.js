import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TreeViewer from "./TreeViewer";
import { Link } from "react-router-dom";

const RouterJunction = () => {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/treeviwer">TreeViewer</Link>
          </li>
          <li>
            <Link to="/lionking">Lion King</Link>
          </li>
          <li>
            <Link to="/spiderman">Spider Man</Link>
          </li>
        </ul>
      </div>
      <Route path="/treeviewer" componet={TreeViewer} />
    </Router>
  );
};

export default RouterJunction;

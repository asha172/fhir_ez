import React from 'react';
import './App.css';
// import ResourceDetails from './components/ResourceDetails';
// import ResourceDetails1 from './components/ResourceDetails1';
// import Test from './components/test';
// import TreeTest from './components/TreeTest';
import Tree from './components/Tree';

const treeStyles = {
  position: 'absolute',
  top: 20,
  left: 20,
  color: 'white',
  fill: 'white',
  width: '100%',
}

const typeStyles = {
  fontSize: '1em',
  verticalAlign: 'middle',
}


function App() {
  // return  <ResourceDetails1/>
  // return <ResourceDetails1/>
  return (
    <div className="treeview-main">
      <Tree content="main" type="ITEM" canHide open style={treeStyles}>
        <Tree
          content="hello"
          type={<span style={typeStyles}>🙀</span>}
          canHide
        />
        <Tree content="subtree with children" canHide>
          <Tree content="hello" />
          <Tree content="sub-subtree with children">
            <Tree content="child 1" style={{ color: '#63b1de' }} />
            <Tree content="child 2" style={{ color: '#63b1de' }} />
            <Tree content="child 3" style={{ color: '#63b1de' }} />
          </Tree>
          <Tree content="hello" />
        </Tree>
        <Tree content="hello" canHide />
        <Tree content="hello" canHide />
      </Tree>
    </div>
  )
}

export default App;

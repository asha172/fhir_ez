import React from 'react'
import Tree from './Tree'
import './styles.css'


const treeStyles = {
    position: "absolute",
    top: 20,
    left: 20,
    color: "black",
    fill: "black",
    width: "100%"
  };
  
  const typeStyles = {
    fontSize: "1em",
    verticalAlign: "middle"
  };

const TreeViewer = () =>
{
    return (
        <div className="treeview-main">
            강인철강인철
        {/* <Tree content="main" type="ITEM" canHide open style={treeStyles}>
          <Tree
            content="hello"
            type={<span style={typeStyles}>🙀</span>}
            canHide
          />
          <Tree content="subtree with children" canHide>
            <Tree content="hello" />
            <Tree content="sub-subtree with children">
              <Tree content="child 1" style={{ color: "#63b1de" }} />
              <Tree content="child 2" style={{ color: "#63b1de" }} />
              <Tree content="child 3" style={{ color: "#63b1de" }} />
            </Tree>
            <Tree content="hello" />
          </Tree>
          <Tree content="hello" canHide />
          <Tree content="hello" canHide />
        </Tree> */}
      </div>
    )
}

export default TreeViewer;
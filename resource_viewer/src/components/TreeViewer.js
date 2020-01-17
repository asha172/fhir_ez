import React from "react";
import Tree from "./Tree";
import "./styles.css";

const treeStyles = {
  position: "absolute",

  color: "black",
  fill: "black",
  width: "100%"
};

const typeStyles = {
  fontSize: "1em",
  verticalAlign: "middle"
};

const DataTypes = {
  Null: "Null",
  Object: "Object",
  Array: "Array",
  String: "String",
  Boolean: "Boolean",
  Number: "Number",
  Date: "Date"
};

function getTypeof(obj) {
  if (obj instanceof Array) return DataTypes.Array;
  else if (obj instanceof Object) return DataTypes.Object;
  else if (typeof obj === "string" || obj instanceof String)
    return DataTypes.String;
  else if (typeof obj === "number" || obj instanceof Number)
    return DataTypes.Number;
  else if (typeof obj === "boolean" || obj instanceof Number)
    return DataTypes.Number;
  else if (obj instanceof Boolean) return DataTypes.Boolean;
  else return DataTypes.Null;
  // return Object.prototype.toString.call(obj).slice(8, -1)
}

function generateSpan(key, value) {
  return (
    <span>
      {key} {value}
    </span>
  );
}

function generateTree(key, values, childTree=null) {
  let spanItem = generateSpan(key, values);

return <Tree content={spanItem} open>{childTree !== null && childTree}</Tree>;
}

const createTreeViewer = jsonData => {
  return Object.keys(jsonData).map(key => {
    if(key === 'differential') return null;
    if(key==='snapshot' || key==='element' || key==='id'){
      let values = jsonData[key];
      let valueString = null;
      let childFlag = false;
      let childTrees = null;

      switch (getTypeof(values)) {
        case DataTypes.Object:
          if(key === 'id')
          {
            console.log(values)
          }
          childFlag = true;
          childTrees = createTreeViewer(values)
          break;
        case DataTypes.Array:          
          if (getTypeof(values[0])=== DataTypes.Object)
          {
              childFlag = true;
              
              childTrees = values.map(subValues => createTreeViewer(values))
              childTrees = childTrees.filter(ch=> { return ch !== null})

              // console.log(childTrees)
          }          
          else if (getTypeof(values[0]) === DataTypes.subValues)
            valueString = values.toString()
          break;      
        case DataTypes.String:
        case DataTypes.Boolean:
        case DataTypes.Number:
          valueString = values
          break;
        default:
          valueString = values.toString() + ' Error!!'
      }
      
      return generateTree(key, valueString, childTrees);
    }
    else return null;
  });
  
};

const TreeViewer = () => {
  var jsonDataObj = require("../resources/patient.profile.json");
  return (
    <div>{createTreeViewer(jsonDataObj)}</div>
    // <div className="treeview-main">
    //     <Tree content="main" type="ITEM" canHide open style={treeStyles}>
    //       <Tree
    //         content="hello"
    //         type={<span style={typeStyles}>🙀</span>}
    //         canHide
    //       />
    //       <Tree content="subtree with children" canHide>
    //         <Tree content="hello" />
    //         <Tree content="sub-subtree with children">
    //           <Tree content="child 1" style={{ color: "#63b1de" }} />
    //           <Tree content="child 2" style={{ color: "#63b1de" }} />
    //           <Tree content="child 3" style={{ color: "#63b1de" }} />
    //         </Tree>
    //         <Tree content="hello" />
    //       </Tree>
    //       <Tree content="hello" canHide />
    //       <Tree content="hello" canHide />
    //     </Tree>
    //   </div>
  );
};

export default TreeViewer;

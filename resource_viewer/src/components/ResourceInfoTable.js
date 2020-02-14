import React from "react";
import "./styles.css";

import ResourceInfoItem from "./ResourceInfoItem";

const ResourceInfoTable = ({dataSource, onClick}) => {
  console.log("ResourceInfoTable rendered")
  const generateTrTag = (
    dataSource,
    isParentLast = false,
    isLastNode = false,
    onClick
  ) => {
    let trTagList = [];
    let subTRList = [];
    
    trTagList.push(
      <ResourceInfoItem itemData={dataSource} isParentLast={isParentLast}
        isLastNode={isLastNode} onClick={onClick}/>
    );

    if (dataSource.children.length > 0) {
      for (let i = 0; i < dataSource.children.length; i++) {
        let depth = dataSource.depth;
        if (depth === 0) isParentLast = i === dataSource.children.length - 1;
        isLastNode = i === dataSource.children.length - 1;
        let itemData = dataSource.children[i];

        if (itemData.children.length > 0) {
          let childTrList = generateTrTag(itemData, isParentLast, isLastNode, onClick);
          subTRList = subTRList.concat(childTrList);
        } else {
          let trTag = (
            <ResourceInfoItem itemData={itemData} isParentLast={isParentLast}
              isLastNode={isLastNode} onClick={onClick} />
          );
          subTRList.push(trTag);
        }
      }
    }

    return trTagList.concat(subTRList);
  };

  return (
    <table key="1" className="resourceinfo-table">
      <thead>
        <tr className="resourceinfo-header">
          <th style={{ width: "230px" }}>Name</th>
          <th>Card.</th>
          <th style={{ width: "100px" }}>Type</th>
          <th style={{ width: "350px" }}>Description</th>
        </tr>
      </thead>
      <tbody key="2">{generateTrTag(dataSource, false, false, onClick)}</tbody>
    </table>
  );
};

export default React.memo(ResourceInfoTable);

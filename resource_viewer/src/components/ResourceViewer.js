import React from "react";
import * as style from "./resourceViewer.style.js";
import "./styles.css";

import ResouceInfoList from "./ResourceInfoTable";

const ResourceViewer = ({ dataSource, onClick }) => {
  console.log('ResourceViewer Rendered') 

  return (
    <table  key='1' className="resourceinfo-table">
      <thead>
        <tr className="resourceinfo-header">
          <th style={{ width: "230px" }}>Name</th>
          <th>Card.</th>
          <th style={{ width: "100px" }}>Type</th>
          <th style={{ width: "350px" }}>Description</th>
        </tr>
      </thead>
      <tbody  key='2'>
        <ResouceInfoList sourceData={dataSource} onClick={onClick} />
      </tbody>
    </table>
  );
};

// export default React.memo(ResourceViewer);
export default ResourceViewer;


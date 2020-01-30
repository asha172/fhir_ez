import React, { useState, useCallback, useMemo } from "react";
import ResourceViewer from "./ResourceViewer";
import { Tabs, Tab } from "react-bootstrap";
import JsonViewer from "./JsonViewer";
import { getSnapShotData } from "../modules/dataObjManager";
import createDataObject from "../modules/dataObjManager";
import ResourceDetailsPopup from "./ResourceDetailSPopup";
import "./styles.css";

const ResourceOverview = ({ match }) => {
  console.log("ResourceOverview")
  const [selectRow, setSelectRow] = useState(null);

  const calledResource = match.params.resource;
  var jsonDataObj = useMemo(() => require( "../resources/" +  calledResource.toLowerCase() + ".profile.json"), [calledResource]);

  const snapShot = useMemo(() => getSnapShotData(jsonDataObj), [jsonDataObj]);   
  const dataSource = useMemo(()=> createDataObject(snapShot).resrouceDataObj, [snapShot]);


  const onClick = useCallback(e => {
    
    let selectedRowID = e.currentTarget.id;
    let splitedIDs = selectedRowID.split(".");
    // let depth = splitedIDs.length;

    const getSelectedRowData = (id, dataSource) => {
      for (let dataItem of dataSource) {
        if (dataItem.name === id) return dataItem;
      }
    };

    let destSourceData = dataSource;

    if (splitedIDs.length > 1) {
      for (let i = 1; i < splitedIDs.length; i++) {
        let splitedId = splitedIDs[i];
        destSourceData = getSelectedRowData(splitedId, destSourceData.children);
      }
    }
    setSelectRow(destSourceData);
  }, [dataSource]);

  return (
    <div>
      {/* <div>{createDataObject(elementDataObj).divs}</div> */}
      {}
      <br />
      <br />
      <div className="wrapper round-div">
        <div>
          {"⭐️"} {calledResource} Structure{" "}
        </div>

        <div>
          <Tabs style={{borderBottom: '0px'}}
            defaultActiveKey="structure"
            transition={false}
            id="uncontrolled-tab-example">
            <Tab eventKey="structure" title="Structure">
              <div className="snapshop-container">
                <div className="snapshop-left">
                  <ResourceViewer
                    resourceName={calledResource} 
                    dataSource={dataSource}
                    onClick={onClick}/>
                </div>
                <div className="snapshop-right">
                  <div className="details-popup">
                    <ResourceDetailsPopup dataSource={selectRow}/>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="details" title="Details">
              
            </Tab>
            <Tab eventKey="joson" title="Json">
              {/* <JsonViewer jsonObj={snapShot} /> */}
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResourceOverview);

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import JsonViewer from "./JsonViewer";
import { getSnapShotData } from "../modules/dataObjManager";
import createDataObject from "../modules/dataObjManager";
import ResourceDetailsPopup from "./ResourceDetailSPopup";
  import "./styles.css";
  import ResourceInfoTable from "./ResourceInfoTable";

const ResourceOverview = ({ match }) => {
  console.log("ResourceOverview")
  
  // 생성자와 같은 기능 but... lifeCycle 상 렌더링 된 후에 호출되므로 부작용 생각해봐야 함.
  useEffect(() => {    
    setSelectedRow(null)
    setRowPopupTop(0)
  }, [match]);

  const calledResource = match.params.resource;

  const [selectedRow, setSelectedRow] = useState(null);
  const [detailsPopupTop, setDetailsPopupTop] = useState(20);
  const [rowPopupTop, setRowPopupTop] = useState(0);  
  
  let jsonDataObj = useMemo(() => require( "../resources/" +  calledResource.toLowerCase() + ".profile.json"), [calledResource]);
  const snapShot = useMemo(() => getSnapShotData(jsonDataObj), [jsonDataObj]);   
  const dataSource = useMemo(()=> createDataObject(snapShot).resrouceDataObj, [snapShot]);

    
  const resourceTableEL = useRef(null); 
 
  function ShowDetailsPopup(e, dataSource) {
    
    let selectedRowID = e.currentTarget.id;
    let splitedIDs = selectedRowID.split(".");

    const getSelectedRowData = (id, dataSource) => {
      for (let dataItem of dataSource) {
        if (dataItem.name === id)
          return dataItem;
      }
    };

    let destSourceData = dataSource;
    if (splitedIDs.length > 1) {
      for (let i = 1; i < splitedIDs.length; i++) {
        let splitedId = splitedIDs[i];
        destSourceData = getSelectedRowData(splitedId, destSourceData.children);
      }
    }
    setSelectedRow(destSourceData);
  }
  
  const ResourceRowOnClick = useCallback(e => {
    ShowDetailsPopup(e, dataSource);
    let refTop =  e.currentTarget.offsetTop
    setRowPopupTop(refTop)
    
  }, [dataSource]);

  
  const detailsPopupEL = useCallback(node => {
    if (node !== null) {
    
    let detailsPopupBottom = rowPopupTop + node.offsetHeight;
    let limitBottom = resourceTableEL.current.offsetHeight;
    let popupTop = 0;
    if(detailsPopupBottom > limitBottom){
      popupTop = rowPopupTop - (detailsPopupBottom - limitBottom)
    }
    else{
      popupTop = rowPopupTop
    }
    
    setDetailsPopupTop(popupTop)
    }
  },[rowPopupTop]);

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
                <div ref={resourceTableEL} className="snapshop-left" >
                  <ResourceInfoTable               
                    dataSource={dataSource}
                    onClick={ResourceRowOnClick}/>
                </div>
                <div className="snapshop-right">
                  <div ref={detailsPopupEL} className="details-popup" style={{marginTop: `${detailsPopupTop}px`}}>
                    <ResourceDetailsPopup dataSource={selectedRow}/>
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



import React from 'react';
import ResourceViewer from './ResourceViewer';
import { Tabs, Tab } from 'react-bootstrap';
import JsonViewer from './JsonViewer';
import {getSnapShotData} from '../modules/dataObjManager'


const ResourceInfo = ({ match }) => {
    console.log(match.params.resource)
    const calledResource = match.params.resource;

    var jsonDataObj = require('../resources/' + calledResource.toLowerCase() + '.profile.json');
    var snapShotJsonData = getSnapShotData(jsonDataObj)
    return (
        <div>
            {/* <div>{createDataObject(elementDataObj).divs}</div> */}
            {}
            <br />
            <br />
            <div className="wrapper round-div">
                <div >{'⭐️'} {calledResource} Structure </div>

                <div>
                    <Tabs defaultActiveKey="structure" id="uncontrolled-tab-example">
                        <Tab eventKey='structure' title="Structure">
                            <ResourceViewer resourceName={calledResource} jsonData={snapShotJsonData} />
                        </Tab>
                        <Tab eventKey='details' title='Details'>

                        </Tab>
                        <Tab eventKey='joson' title='Json'>
                            <JsonViewer jsonObj={snapShotJsonData}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default ResourceInfo;
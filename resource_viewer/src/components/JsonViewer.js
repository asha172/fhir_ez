import React from 'react';
import ReactJson from 'react-json-view'


const JsonViewer = ({jsonObj}) => {
    console.log('JsonViewer App');
    const jsonData =  jsonObj
    return <ReactJson
    src={jsonData}
    onAdd={false}
    onEdit={false}
    onDelete={false}
    onSelect={false}
    enableClipboard={false}
    collapsed={false}
    displayDataTypes={false}
    displayObjectSize={false}/>
}

export default React.memo(JsonViewer)
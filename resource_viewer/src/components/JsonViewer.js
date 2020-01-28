import React from 'react';
import ReactJson from 'react-json-view'


const JsonViewer = ({jsonObj}) => {
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

export default JsonViewer
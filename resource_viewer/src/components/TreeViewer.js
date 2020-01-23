import React, { useState } from "react";

import "./styles.css";
import * as style from "./resourceGrid.style.js";

import tbl_vjoin from './img/tbl_vjoin.png';
import tbl_vline from './img/tbl_vline.png';

import tbl_bck1 from './img/tbl_bck1.png';
import tbl_bck10 from './img/tbl_bck10.png';
import tbl_bck11 from './img/tbl_bck11.png';
import tbl_bck110 from './img/tbl_bck110.png';
import tbl_bck100 from './img/tbl_bck100.png';

import tbl_bck000 from './img/tbl_bck000.png';
import tbl_bck010 from './img/tbl_bck010.png';
import tbl_bck01 from './img/tbl_bck01.png';

import tbl_spacer from './img/tbl_spacer.png';
import tbl_vjoin_end from './img/tbl_vjoin_end.png';
import tbl_blank from './img/tbl_blank.png';

import icon_resource from './img/icon_resource.png';
import icon_datatype from './img/icon_datatype.gif'
import icon_primitive from './img/icon_primitive.png'
import icon_element from './img/icon_element.gif'
import icon_choice from './img/icon_choice.gif'
import icon_reuse from './img/icon_reuse.png'
import icon_reference from './img/icon_reference.png'


import * as CD  from '../modules/constantData.js'
import createDataObject from '../modules/dataObjManager';

const oddRowBGColor = "#F7F7F7"

const gethierachyLineIMG = (dataSource, isParentLast, isLastNode) => {
  // 'ch' means child
  //ROOT == tbl_bck1.png
  //depth 1 and no ch == tbl_bck10.png 
  //depth 1 and has ch == tbl_bck11.png 
  //depth 1 and last and no ch == ???????
  //depth 1 and last and has ch == tbl_bck01.png 

  //depth 2  == tbl_bck110.png 
  //depth 2 and lastnode  == tbl_bck100.png 

  //depth 2 and lastParent and no lastnode  == tbl_bck010.png 
  //depth 2 and lastParent and lastnode == tbl_bck000.png 

  let hierachyLineIMG = null


  switch(dataSource.depth){
    case 0:
      hierachyLineIMG = tbl_bck1;
      break
    case 1:
      let hasChild = dataSource.children.length > 0;
      if(!isLastNode){
       if(!hasChild) hierachyLineIMG = tbl_bck10;
       if(hasChild) hierachyLineIMG = tbl_bck11;
      } else 
      if(isLastNode){
        if(!hasChild) hierachyLineIMG = tbl_bck10;
        if(hasChild) hierachyLineIMG = tbl_bck01;
      }
      break
    case 2:
      if(isParentLast)
      { 
        if(!isLastNode) hierachyLineIMG = tbl_bck010;
        if(isLastNode) hierachyLineIMG = tbl_bck000;        
      }
      else if(!isParentLast){        
        if(!isLastNode) hierachyLineIMG = tbl_bck110;
        if(isLastNode) hierachyLineIMG = tbl_bck100;
      }       
      break
    default :
      hierachyLineIMG = tbl_bck1;
  }

  return hierachyLineIMG;
}

const getDataTypeIcon = dataType =>{
  let typeIMG = null
  console.log(dataType)
  if(CD.PremitiveDataTypes.includes(dataType)) typeIMG = icon_primitive
  else if((CD.GlobalDataTypes.includes(dataType)) ) typeIMG = icon_datatype
  else if((CD.ElementTypes.includes(dataType)) ) typeIMG = icon_element  
  else if((CD.MultiType === dataType)) typeIMG = icon_choice
  else if((dataType.startsWith(CD.ReferenceType)))
  {
    typeIMG = icon_reference
    
  } 
  
  else if((CD.ReferenceRangeType === dataType) ) typeIMG = icon_reuse
  else if((CD.DomainResourceType === dataType) ) typeIMG = icon_resource

  return typeIMG
}

const generateDataTypeIconTag = (dataType, idOddRow) =>{
  
  let dynamicStyle = !idOddRow ? {...style.dataTypeIconStyle, backgroundColor:oddRowBGColor} :style.dataTypeIconStyle
  let iconImg = getDataTypeIcon(dataType)  
  let typeIconTag = <img src={iconImg} alt="." style={dynamicStyle} title={dataType}/>

  return typeIconTag
}

const generateTDTag = (dataSource, generateHierachyTag, isParentLast, isLastNode) =>{
  
  let dataTypeIcon = generateDataTypeIconTag(dataSource.type);  
  let hierachyLineIMG = gethierachyLineIMG(dataSource, isParentLast, isLastNode);
  let diynamicFirstTdStyle = {...style.firstTdStyle, backgroundImage:`url(${hierachyLineIMG})`}

  let trItem = <>
                <td style={diynamicFirstTdStyle}>{generateHierachyTag}{dataTypeIcon}{dataSource.name}</td>
                <td style={style.tdStyle}>{dataSource.cardi}</td>
                <td style={style.tdStyle}>{dataSource.type !== CD.MultiType&&dataSource.type}</td>
                <td style={style.tdStyle}>{dataSource.short}</td>
            </>;   

  return trItem
}

const generateTRTag = (tdTags, idOddRow) =>{
  let dynamicTrStyle = !idOddRow ? {...style.trStyle, backgroundColor:oddRowBGColor} :style.trStyle
  let trItem = <tr style={dynamicTrStyle}>
                {tdTags}
            </tr>;   

  return trItem
}

const generateHierachyImgTag = (depth, isParentLastNode,isLastNode) =>{
  
  let innerTag = null  
  // ##EndNode 스타일 셋팅
  let joinPath = !isLastNode ? tbl_vjoin : tbl_vjoin_end 
  let parentPath = !isParentLastNode ? tbl_vline : tbl_blank   
  
  if(depth===1){
    innerTag =<>
                <img src={tbl_spacer} alt="." style={style.imgStyle} title="tbl_spacer"/>
                <img src={joinPath} alt="." style={style.imgStyle}  title="joinPath"/>
              </>
  }
  else if(depth===2){
    innerTag =<>
                <img src={tbl_spacer} alt="." style={style.imgStyle} title="tbl_spacer"/>
                <img src={parentPath} alt="." style={style.imgStyle} title="tbl_blank"/>
                <img src={joinPath} alt="." style={style.imgStyle}  title="joinPath"/>
              </>
  }
  
  return innerTag
}

const convertDataToTRTags = (sourceBodyDatas, isLastTRNode = false, isLastTDNode = false) => {
  
  let dataSource = sourceBodyDatas
  let depth = sourceBodyDatas.depth;  
  let trTagList = []  
  let tdList = [] 
  // console.log(dataSource.name, isLastTDNode)
  let hierachyImgTag = generateHierachyImgTag(depth, isLastTRNode, isLastTDNode)
  let tdTag =  generateTDTag(dataSource, hierachyImgTag, isLastTRNode, isLastTDNode)
  let childrenTds = [];

  tdList.push(tdTag)

  if(dataSource.children.length > 0){
    
    for(var i =0; i <dataSource.children.length; i++){
      
      if(depth === 0) isLastTRNode = i === dataSource.children.length-1      
      isLastTDNode = i === dataSource.children.length-1

      // console.log(dataSource.name, isLastTDNode, i, dataSource.children.length-1)
      let childTd = convertDataToTRTags(dataSource.children[i], isLastTRNode, isLastTDNode)      
      childrenTds = childrenTds.concat(childTd)
    }
  }
  
  if(depth === 0){
    if(dataSource.children.length > 0){    
      tdList = tdList.concat(childrenTds.flat(Infinity))
      
      for(let i=0; i<tdList.length; i++){
        let subTrTag = generateTRTag(tdList[i], i%2 === 0)
        trTagList.push(subTrTag)        
      }      
    }
  }
  else{    
    if(childrenTds.length > 0) tdList = tdList.concat(childrenTds);
    
    return tdList
  }

  return trTagList
};

const createProfileGrid = sourceData => {
  const tableStyle ={
    border: "0px #F0F0F0 solid",
    fontSize:"11px",
    fontFamily: "verdana",
    verticalAlign: "top",
    borderCollapse: "collapse"
  }

  const headerTrStyle = {
    border: "1px #F0F0F0 solid",
    fontSize: "11px",
    fontFamily: "verdana",
    verticalAlign: "top"
  }

  let tableBodyTags = convertDataToTRTags(sourceData);
  let resourceInfoTable = (
    <table style={tableStyle}>
      <tr style={headerTrStyle}>
        <th style={{width:"250px"}}>Name</th>
        <th>Card.</th>
        <th style={{width:"100px"}}>Type</th>
        <th style={{width:"200px"}}>Description</th>
      </tr>
      {tableBodyTags}
    </table>
  );
  return resourceInfoTable;
};

const TreeViewer = () => {
  var jsonDataObj = require("../resources/patient.profile.json");
  // var treeDataSource = createDataObject(elementDataObj).dataInfos;
  var treeDataSource = createDataObject(jsonDataObj).resrouceDataObj;
  // console.log(treeDataSource)
  
  return (    
    <div>
      {/* <div>{createDataObject(elementDataObj).divs}</div> */}
      <br />
      <br />
      <div className="wrapper round-div">
        <div >{'⭐️'} Structure </div>
        <div>{createProfileGrid(treeDataSource)}</div>
      </div>
    </div>
  );
};



export default TreeViewer;



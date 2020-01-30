import React from "react";
import * as CD from "../modules/constantData.js";

export const getSnapShotData = (jsonData) => {
  return getElemenData(jsonData, "snapshot");
}

function getElemenData(jsonData, elementName) {
  let snapShopObj = jsonData[elementName];
  return Object.keys(snapShopObj).map(key => {
    if (key === "element") return snapShopObj[key];
    else return null;
  });
}

function createInitialElementInfo(name, parent_id, id, depth) {
  return {
    id: id,
    parent_id: parent_id,
    name: name,
    depth: depth,
    alias: null,
    cardi: null,
    type: null,
    short: null,
    definition: null,
    requirements: null,
    comment: null,
    constraint: [],
    defaultValue: null,
    mapping:[],
    children: []
    
  };
}

const excludeElement = [
  "id",
  "meta",
  "implicitRules",
  "language",
  "text",
  "contained",
  "extension",
  "modifierExtension"
];

function generateIDInfos(jsonData) {
  let pathValue = jsonData["path"];
  let splitedPathStrs = pathValue.split(".");
  let parent_id = null;
  let id = null;
  let name = splitedPathStrs[splitedPathStrs.length - 1];

  if (splitedPathStrs.length > 1) {
    parent_id = splitedPathStrs.slice(0, splitedPathStrs.length - 1).join(".");
    id = splitedPathStrs.slice(0, splitedPathStrs.length).join(".");
  } else {
    id = name;
  }

  return {
    id: id,
    parent_id: parent_id,
    name: name,
    depth: splitedPathStrs.length - 1
  };
}

function generateCardinalityInfo(jsonData) {
  let min = jsonData["min"];
  let max = jsonData["max"];

  if (typeof min === "number" && max) {
    return min.toString() + ".." + max.toString();
  } else return null;
}

function genereateReferenceType(typeDatas) {
  let firstTypeData = typeDatas[0]
  let resultTypeStr = firstTypeData.code;
  let targetProfiles = []

  if (firstTypeData.targetProfile instanceof Array) {
    typeDatas.forEach(typeData =>
      targetProfiles = targetProfiles.concat(typeData.targetProfile));
  }
  else {
    targetProfiles = typeDatas.map(typeData => typeData.targetProfile)
  }

  targetProfiles = targetProfiles.map(target =>
    target.split("/").slice(-1))
  let joinedProfiles = targetProfiles.join(" | ")
  resultTypeStr = resultTypeStr + "(" + joinedProfiles + ")";
  return resultTypeStr
}

function generateValueXType(typeDatas, sourceElementInfo)
{
  sourceElementInfo.children = typeDatas.map(typeData => {
    let childName =
      sourceElementInfo.name.replace("[x]", "") +
      typeData.code.charAt(0).toUpperCase() +
      typeData.code.slice(1);
    let childElementInfo = createInitialElementInfo(
      childName,
      sourceElementInfo.id,
      sourceElementInfo.id + "." + childName,
      sourceElementInfo.depth + 1
    );
    childElementInfo.type = typeData.code;
    return childElementInfo;
  });

  return CD.MultiType;
}

function generateNormalType(typeDatas, sourceElementInfo) {
  let resultTypeStr = null;
  let code = typeDatas[0].code

  if (code === 'Reference') {
    resultTypeStr = genereateReferenceType(typeDatas)
  }
  else if (typeDatas.length > 1) {
    resultTypeStr = generateValueXType(typeDatas, sourceElementInfo)
  }
  else resultTypeStr = typeDatas[0].code;

  return resultTypeStr;
}

function generateAbnormalType(typeDatas, sourceElementInfo) {
  let resultTypeStr = null;

  if (sourceElementInfo.depth === 0) {
    resultTypeStr = CD.DomainResourceType;
  } else if (sourceElementInfo.name === CD.ReferenceRangeType) {
    resultTypeStr = CD.ReferenceRangeType
  } else resultTypeStr = "NO type Check!!";

  return resultTypeStr;
}

function generateType(jsonData, sourceElementInfo) {
  let typeDatas = jsonData["type"];
  let resultTypeStr = null;

  try {
    if (typeDatas !== undefined) {
      resultTypeStr = generateNormalType(typeDatas, sourceElementInfo)
    }
    else {
      resultTypeStr = generateAbnormalType(typeDatas, sourceElementInfo)
    }
  } catch (error) {
    console.log(jsonData)
    throw error
  }

  return resultTypeStr;
}

function generateAlias(jsonData)
{
  if(!jsonData.hasOwnProperty('alias')) return null;
  let alias = jsonData["alias"];
  let genAlias = alias.join(', ')
  return genAlias;
}

function createDataItem(jsonData) {
    let idInfos = generateIDInfos(jsonData);
    if (excludeElement.includes(idInfos.name)) {
      let exceptRule =
        idInfos.name === "language" &&
        idInfos.parent_id.indexOf("communication") > -1;
      if (!exceptRule) return null;
    }

    let elementInfo = createInitialElementInfo(
      idInfos.name,
      idInfos.parent_id,
      idInfos.id,
      idInfos.depth
    );

    elementInfo.cardi = elementInfo.depth !== 0 ? generateCardinalityInfo(jsonData) : null;
    elementInfo.type = generateType(jsonData, elementInfo);    
    elementInfo.alias = generateAlias(jsonData)
    elementInfo.constraint = generateConstraint(jsonData)
    elementInfo.binding = generateBinding(jsonData)
    elementInfo.mapping = generateMapping(jsonData)
    
    elementInfo.short = jsonData["short"];
    elementInfo.definition = jsonData["definition"];
    elementInfo.comment = jsonData["comment"];
    elementInfo.requirements = jsonData["requirements"];

    return elementInfo;
}

function generateConstraint(jsonData)
{
  if(!jsonData.hasOwnProperty('constraint')) return null;

  return jsonData['constraint'].map(data =>
    {
      let key = data['key']
      let human = data['human']
      return {key:key, value:human}    
    } )
}

function generateMapping(jsonData)
{
  let resultList = []
  jsonData['mapping'].forEach(data =>
    {
      let key = data['identity']
      let map = data['map']
      if(map.toLowerCase() !== 'n/a') resultList.push({key:key, value:map});
    })

  return resultList
}

function generateBinding(jsonData){
  if(!jsonData.hasOwnProperty('binding')) return null;
  let bindings = jsonData["binding"];
  
  let strength = bindings.strength
  let splitedValueSets = null;
  if(bindings.hasOwnProperty('valueSet')) 
    splitedValueSets= bindings.valueSet.split('/')
  else if(bindings.hasOwnProperty('valueSetReference'))
    splitedValueSets= bindings.valueSetReference.reference.split('/')
  else{
    throw new Error("binding property Error")
  }
    

  let valueSet = splitedValueSets[splitedValueSets.length-1]
  return valueSet + "(" + strength  + ")";
}

const createDataObject = jsonData => {
  console.log('createDataObject called')
  // var snapShotDataObj = getElemenData(jsonData);
  var snapShotDataObj = jsonData;
  let dataInfos = [];
  let dataDic = {};

  Object.keys(snapShotDataObj).forEach(key => {
    let values = snapShotDataObj[key];

    values.forEach(subValues => {
      let result = createDataItem(subValues);
      if (result != null) {
        dataDic[result.id] = result;

        if (result.parent_id != null) {
          if (dataDic.hasOwnProperty(result.parent_id)) {
            dataDic[result.parent_id].children.push(result);
          } else {
            console.log("부모 없음 에러!!   ", result.parent_id);
          }
        }
      }
    });
  });

  let divs = dataInfos.map(dataInfo => (
    <div>
      {dataInfo.name} : {dataInfo.short} : {dataInfo.parent_id} : {dataInfo.id}{" "}
      : {dataInfo.depth}
    </div>
  ));

  //   console.log(dataDic)
  return {
    resrouceDataObj: Object.values(dataDic)[0],    //.dataDic["Patient"],
    dataInfos: dataInfos,
    divs: divs
  };
};

export default createDataObject;

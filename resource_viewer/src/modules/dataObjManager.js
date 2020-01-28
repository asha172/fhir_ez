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
    cardi: null,
    type: null,
    short: null,
    depth: depth,
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

function getIDInfos(jsonData) {
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

function generateNormalTypeInfo(typeDatas, sourceElementInfo) {
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

function generateAbnormalTypeInfo(typeDatas, sourceElementInfo) {
  let resultTypeStr = null;

  if (sourceElementInfo.depth === 0) {
    resultTypeStr = CD.DomainResourceType;
  } else if (sourceElementInfo.name === CD.ReferenceRangeType) {
    resultTypeStr = CD.ReferenceRangeType
  } else resultTypeStr = "NO type Check!!";

  return resultTypeStr;
}

function generateTypeInfo(jsonData, sourceElementInfo) {
  let typeDatas = jsonData["type"];
  let resultTypeStr = null;

  try {
    if (typeDatas !== undefined) {
      resultTypeStr = generateNormalTypeInfo(typeDatas, sourceElementInfo)
    }
    else {
      resultTypeStr = generateAbnormalTypeInfo(typeDatas, sourceElementInfo)
    }
  } catch (error) {
    console.log(jsonData)
    throw error
  }

  return resultTypeStr;
}

function createDataItem(jsonData) {
  let idInfos = getIDInfos(jsonData);
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
  elementInfo.type = generateTypeInfo(jsonData, elementInfo);
  elementInfo.short = jsonData["short"];

  return elementInfo;
}

const createDataObject = jsonData => {
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

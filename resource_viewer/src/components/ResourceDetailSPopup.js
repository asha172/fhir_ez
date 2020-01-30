import React from "react";

const ResourceDetailSPopup = ({dataSource}) => {
    if(dataSource=== null) return null;

    const detialsDispalyItems = {
        id : 'Element ID',
        alias : 'alias',
        short : 'short Desc.',
        definition : 'Definition',
        requirements : 'Requirements',
        binding : 'Binding',
        constraint : 'Constraints',
        mapping : 'Mappings',
    }

    const generateObejctToUITag = dataObj => {
        return (
          <ul>            
            {dataObj.map(data => {
              let key = data.key;
              let value = data.value;
              return <li> <span><b>{key} :</b></span> <span>{value}</span></li>
            })}
          </ul>
        );
      };    

    let keysList = Object.keys(detialsDispalyItems);
    let keysLen = keysList.length

    return (
        <div >{            
            keysList.map((key, idx) => {    
                
                let title = detialsDispalyItems[key];
                let value = null;
                
                switch(key){
                    case 'constraint':
                        if(dataSource.constraint != null)
                            value = <div>{generateObejctToUITag(dataSource.constraint)}</div>   
                        else
                            value = null
                        break;
                    case 'mapping':
                        if(dataSource.constraint != null)
                        value = <div>{generateObejctToUITag(dataSource.mapping)}</div>  
                    else
                        value = null                           
                        break;
                    default :
                        value = <p className="details-value-p">{dataSource[key]}</p>
                        break;
                }
               
                let borderWidth = idx===keysLen-1 ? '0px 0px 0px 0px' : '0px 0px 1px 0px'
                return (<div className='details-container' style={{borderWidth: borderWidth}} >
                <span><b>{title}</b></span>
                {value}                
                </div>)
            })
        }       
        </div>
        
    );
};

export default React.memo(ResourceDetailSPopup);
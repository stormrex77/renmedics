import React from 'react';

const RenderTime = ({date}) => {
    const getDate = new Date(date);
    const nowDate = new Date();
    const strGetDate = getDate.toLocaleTimeString();
    const strTime = strGetDate.slice(0, strGetDate.length - 6) + '  ' + strGetDate.slice(strGetDate.length - 2, strGetDate.length);
    let strDate = strTime;
    if (nowDate.getDate() > getDate.getDate()){
        strDate = getDate.toDateString().slice(0,3) + ' ' + strTime;
    }
    if ((nowDate.getDate() - getDate.getDate()) > 6){
        strDate = getDate.toLocaleDateString();
    }
    return (
        <span>{strDate}</span>
    )
}

export default RenderTime;
const _ =  require('lodash');

// 电话
const telConvert = (data)=>{
    const { project_name, url, message: messageProps, triggerRule, event } = data || {};
      const message = messageProps || _.get(event, 'metadata.value', '')
    return message;
}

const kunlunConvert = (data, isCollection = false)=>{
    const { web_url, triggerRule } = data || {};
    // 集合上报
    if (isCollection) {
        let str = '';
        _.forEach(data, ({ triggerRule, web_url }) => {
            str += `触发规则: ${triggerRule}\n`
        })
        return str;
    } else {
        // 普通上报
        let text = `触发规则: ${triggerRule}\n`;
        return text
    }
}

module.exports = {
    telConvert,
    kunlunConvert
};
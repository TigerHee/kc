/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useContext} from 'react';
import I18n from 'react-native-i18n';
import {Text} from 'react-native';
import {NumberFormat} from '@krn/ui';
import {BaseLayoutContext} from '../layouts';

const {numberFormat} = NumberFormat;

export default () => {
  const {lang, setLang} = useContext(BaseLayoutContext);

  return {
    lang,
    setLang,
    _t: (key, params) => {
      I18n.locale = lang;
      return I18n.t(key, params);
    },
    // 使用参考
    // 包裹标签名 === 内部参数.toUpperCase()
    // { "test.message.1": "message2, <POST>before text {{post}} after text</POST>message2" }
    // params需要传入对应参数的value和替换组件
    // <RichLocale
    //   id="test.message.1"
    //   params={
    //     post: {
    //       value: 'this is replace context',
    //       component: {component: Text, props: {style: {color: '#f00'}}},
    //     }
    //   }
    // />
    RichLocale: ({id, params}) => {
      I18n.locale = lang;
      // 先将动态参数替换到国际化字符串
      const obj = {};
      Object.keys(params).forEach(i => (obj[i] = params[i].value));
      const message = I18n.t(id, obj);
      return React.useMemo(() => {
        try {
          const nodes = [];
          let messageToParse = message;
          Object.keys(params)
            // 先把当前key在实际国际化字符串出现顺序排一下序
            .sort(
              (a, b) =>
                messageToParse.match(`${a.toUpperCase()}`)?.index -
                messageToParse.match(`${b.toUpperCase()}`)?.index,
            )
            .forEach(paramsKey => {
              // 取要占位的组件，兜底为Text
              const {component: Component, props} = params[paramsKey]
                ?.component || {component: Text};
              const componentRegExp = new RegExp(
                `<${paramsKey.toUpperCase()}>(.*)</${paramsKey.toUpperCase()}>`,
                'm',
              );
              const [beforeText, componentText, restText] =
                messageToParse.split(componentRegExp);
              messageToParse = restText;
              // 字符串拼接
              nodes.push(
                <Text key={paramsKey + beforeText}>{beforeText}</Text>,
                <Component key={paramsKey + componentText} {...props}>
                  {componentText}
                </Component>,
              );
            });
          nodes.push(<Text key={messageToParse}>{messageToParse}</Text>);
          return nodes;
        } catch (e) {
          return message;
        }
      }, [message]);
    },
    numberFormat: (number, params = {}) =>
      numberFormat({
        ...params,
        number,
        lang,
      }),
  };
};

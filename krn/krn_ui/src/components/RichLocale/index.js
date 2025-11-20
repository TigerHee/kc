/**
 * Owner: tiger@kupotech.com
 */
import React, { useMemo } from 'react';
import { Text } from 'react-native';
import registerAPI from 'utils/registerAPI';
import API from './API';

const RichLocale = ({ message = '', renderParams, TextComponent = Text, style={} }) => {
  const elNodes = useMemo(() => {
    try {
      const nodes = [];
      let messageToParse = message;

      const sortParams = Object.keys(renderParams)
        // 先把当前key对应标签在实际国际化字符串出现顺序排一下序
        .sort((a, b) => {
          return (
            messageToParse.match(`${a.toUpperCase()}`)?.index -
            messageToParse.match(`${b.toUpperCase()}`)?.index
          );
        });

      sortParams.forEach((paramsKey) => {
        // 取要占位的组件，兜底为Text
        const { component: Component, componentProps } = renderParams[paramsKey]?.component
          ? renderParams[paramsKey]
          : {
              component: Text,
            };

        const componentRegExp = new RegExp(
          `<${paramsKey.toUpperCase()}>(.*)</${paramsKey.toUpperCase()}>`,
          'm',
        );

        const [beforeText, componentText, restText] = messageToParse.split(componentRegExp);
        messageToParse = restText;
        // 字符串拼接
        nodes.push(
          <TextComponent style={style} key={paramsKey + beforeText}>
            {beforeText}
          </TextComponent>,
          <Component key={paramsKey + componentText} {...componentProps}>
            {componentText}
          </Component>,
        );
      });

      nodes.push(
        <TextComponent style={style} key={messageToParse}>
          {messageToParse}
        </TextComponent>,
      );
      return nodes;
    } catch (e) {
      return <TextComponent style={style}>{message}</TextComponent>;
    }
  }, [message]);

  return elNodes;
};

registerAPI(RichLocale, API);
export default RichLocale;

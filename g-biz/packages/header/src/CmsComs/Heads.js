/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'react-helmet';
import { Parser } from 'html-to-react';
import { namespace } from './model';
import ErrorBoundary from './ErrorBoundary';

const htmlToReactParser = new Parser();

export default function Heads({ lang, run }) {
  const { body } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: `${namespace}/fetch`,
      payload: {
        componentsToload: [run],
        currentLang: lang,
      },
    });
  }, [lang]);
  // 如果有新的heads,需要此处添加; 当前为 com.head
  const keys = ['com.head'];
  return (
    <>
      {map(keys, (key) => {
        const html = body[key];
        if (html) {
          const nodes = htmlToReactParser.parse(`${html}`);

          const childs = [];
          React.Children.forEach(nodes.props.children, (child) => {
            if (React.isValidElement(child)) {
              childs.push(child);
            }
          });

          return (
            <ErrorBoundary key={key}>
              <Head key={key}>{childs} </Head>
            </ErrorBoundary>
          );
        }

        return null;
      })}
    </>
  );
}

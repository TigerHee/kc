import React from 'react';
import Head from 'src/components/Head';
import { customRender } from 'test/setup';

describe('Head', () => {
  test('test Head render', () => {
    customRender(
      <Head title="title" base="base">
        <meta charSet="UTF-8" />
        <link rel="stylesheet" href="https://assets.staticimg.com/natasha/npm/@kux/font/css.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://assets.staticimg.com/web-domain-relation/1.5.23/boot.js" async defer />
      </Head>,
    );
    customRender(
      <Head title="title" base="base">
        1
      </Head>,
    );
    customRender(
      <Head title="title" base="base">
        <React.Fragment>123</React.Fragment>
      </Head>,
    );
  });
});

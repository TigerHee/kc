/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Box, NumberFormat, DateTimeFormat } from '@kux/mui';
import Wrapper from './wrapper';

const Doc = () => {
  return (
    <Box width={1000} style={{ marginLeft: 50 }}>
      <p>DateTime Format:</p>
      <br />
      <DateTimeFormat lang="ar_AE" options={{
        timeZone: 'UTC',
        hour: undefined,
        minute: undefined,
        second: undefined,
      }}>
        2023-10-1 10:10:20
      </DateTimeFormat>
      <br />
      <DateTimeFormat lang="ur_PK">
        2023-10-1 10:10:20
      </DateTimeFormat>
      <br />
      <DateTimeFormat lang="fr_FR">
        2023-10-1 10:10:20
      </DateTimeFormat>
      <br />
      <DateTimeFormat lang="es_ES">
        2023-10-1 10:10:20
      </DateTimeFormat>
      <br />
      <DateTimeFormat lang="zh_CN">
        2023-10-1 10:10:20
      </DateTimeFormat>
      <DateTimeFormat lang="en_US">
        2023-10-1 10:10:20
      </DateTimeFormat>
      <br />
      <DateTimeFormat lang="en_US">
        2023-10-1 00:59:59
      </DateTimeFormat>
      <br />
      <p>Percent Format:</p>
      123456789.456789: ru_RU &nbsp;
      <NumberFormat lang="ru_RU">
      123456789.456789
      </NumberFormat>
      <br />
      0.12333: en_US &nbsp;
      <NumberFormat lang="en_US" options={{ style: 'percent' }}>
        0.12333
      </NumberFormat>
      <br />
      0.12333: ar_AE &nbsp;
      <NumberFormat lang="ar_AE" options={{ style: 'percent' }}>
        0.12333
      </NumberFormat>
      <br />
      <NumberFormat lang="ar_AE" options={{ style: 'percent' }}>
        -0.12333
      </NumberFormat>
      <br />
      0.12333: ur_PK isPositive &nbsp;
      <NumberFormat lang="ur_PK" isPositive options={{ style: 'percent' }}>
        0.12345678908
      </NumberFormat>
      <br />
      -10000.12333: ur_PK &nbsp;
      <NumberFormat lang="ur_PK" options={{ style: 'percent' }}>
        -10000.12333
      </NumberFormat>
      <br />
      <p>大数字：</p>
      <NumberFormat lang="en_US" options={{ notation: 'compact' }}>
        -10000000000
      </NumberFormat>
      <br />
      <NumberFormat lang="en_US" options={{ notation: 'compact' }}>
        100000000000
      </NumberFormat>
      <br />
      <NumberFormat lang="en_US" options={{ notation: 'compact' }}>
        10000000000000
      </NumberFormat>
      <br />
      <NumberFormat lang="zh_CN" options={{ notation: 'compact' }}>
        10000000000000
      </NumberFormat>
      <br />
      <NumberFormat lang="zh_CN">
      185916611.03133229
      </NumberFormat>
    </Box>
  );
};

export default ({ children }) => {
  return (
    <Wrapper>
      <Doc>{children}</Doc>
    </Wrapper>
  );
};

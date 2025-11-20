import React from 'react';

import DateTimeFormat from 'components/Common/DateTimeFormat';

export const ShortDateTimeFormat = props => {
  return (
    <DateTimeFormat
      options={{
        hour: undefined,
        minute: undefined,
        second: undefined,
      }}
      {...props}
    />
  );
};

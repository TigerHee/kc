/**
 * Owner: iron@kupotech.com
 */
export const MessageContentType = {
  TEXT: 0,
  FILE: 1,
  LOCATION: 2,
};

export const MessageType = {
  ...MessageContentType,
  OTHERS: 4,
  MINE: 5,
};

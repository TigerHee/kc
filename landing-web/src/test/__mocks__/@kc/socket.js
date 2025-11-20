/*
 * Owner: terry@kupotech.com
 */
export default {
  setHost: jest.fn(),
  setDelay: jest.fn(),
  setCsrf: jest.fn(),
  connected: jest.fn(),
  getInstance: () => ({
    subscribe: jest.fn(),
    topicMessage: jest.fn(),
  })
}
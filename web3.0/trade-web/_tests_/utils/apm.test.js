import SensorApm from  "src/utils/apm";
import { APMCONSTANTS } from 'utils/apm/apmConstants';

it('SensorApm',() => {
  const sensorsInstance = {};
  const trackSensorInstance = new SensorApm({
    eventName: APMCONSTANTS.TRADE_ORDER_ANALYSE,
  });
  trackSensorInstance.initSensorApm({
    eventName: APMCONSTANTS.TRADE_ORDER_ANALYSE,
  });
  sensorsInstance[APMCONSTANTS.TRADE_ORDER_ANALYSE] =
    trackSensorInstance;
  expect(sensorsInstance[APMCONSTANTS.TRADE_ORDER_ANALYSE]).toEqual(
    expect.objectContaining({
      time: expect.any(Date),
      duration_order: expect.any(Number),
      event_name: APMCONSTANTS.TRADE_ORDER_ANALYSE,
      network_path: expect.any(String),
      is_success: expect.any(Boolean),
      fail_reason: expect.any(String),
    })
  )
});

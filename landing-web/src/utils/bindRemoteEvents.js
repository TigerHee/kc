/**
 * Owner: Lori@kupotech.com
 */

export default async function () {
  return System.import('@remote/tools').then(m => {
    const { remoteEvent } = m.default;
    remoteEvent.on(remoteEvent.evts.GET_DVA, (sendDva) => {
      if (typeof sendDva === 'function') {
        sendDva(window.g_app);
      }
    });

    remoteEvent.on(remoteEvent.evts.GET_REPORT, (sendReport) => {
      if (typeof sendReport === 'function') {
        import('@kc/report').then(({ default: Report }) => {
          sendReport(Report);
        });
      }
    });

    remoteEvent.on(remoteEvent.evts.GET_SENSORS, (sendSensors) => {
      if (typeof sendSensors === 'function') {
        import('@kc/sensors').then(res => {
          const sensors = res?.default || res;
          sendSensors(sensors);
        });
      }
    });
  });
}

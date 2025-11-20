import EventEmitter from 'event-emitter';
import each from 'lodash-es/each';

export const events = {};
export const getEvent = (eventId = 'event') => {
  if (!events[eventId]) {
    events[eventId] = new EventEmitter();
  }
  return events[eventId];
};
export const removeEvent = (eventId) => {
  if (eventId) {
    if (events[eventId]) {
      delete events[eventId];
    }
  } else {
    each(events, (v, evtId) => {
      delete events[evtId];
    });
  }
};

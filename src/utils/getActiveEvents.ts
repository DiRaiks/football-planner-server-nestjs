import { Event } from '../events/interfaces/event.interface';

export const getActiveEvents = (events: Event[]) => {
  if (!events.length) {
    return [];
  }
  const nowMonth = new Date().getMonth();
  const nowDay = new Date().getDate();
  const nowYear = new Date().getFullYear();

  return events.filter((event) => {
    if (new Date(event.date) >= new Date(nowYear, nowMonth, nowDay)) { return event; }
  });
}

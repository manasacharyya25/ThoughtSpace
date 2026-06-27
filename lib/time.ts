const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

function ago(count: number, unit: string): string {
  const label = count === 1 ? unit : `${unit}s`;
  return `${count} ${label} ago`;
}

export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return ago(Math.floor(seconds / MINUTE), "minute");
  if (seconds < DAY) return ago(Math.floor(seconds / HOUR), "hour");
  if (seconds < WEEK) return ago(Math.floor(seconds / DAY), "day");
  if (seconds < MONTH) return ago(Math.floor(seconds / WEEK), "week");
  if (seconds < YEAR) return ago(Math.floor(seconds / MONTH), "month");
  return ago(Math.floor(seconds / YEAR), "year");
}

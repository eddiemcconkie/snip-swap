// Match the greatest time increment from the SurrealDB duration string
// Looks something like 1y21w1d3h54m33s445ms917163ns
const matcher = /^(\d+)([ywdhms])/;

const timeIncrement: Record<string, string> = {
  y: 'year',
  w: 'week',
  d: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
};

function formatIncrement(duration: number, increment: string) {
  if (duration === 1) {
    return `${duration} ${timeIncrement[increment]} ago`;
  }
  return `${duration} ${timeIncrement[increment]}s ago`;
}

export function formatSince(since: string) {
  // Cut off everything after milliseconds
  since = since.slice(0, since.indexOf('ms'));
  const match = since.match(matcher);
  if (!match) {
    return 'just now';
  }
  // const [_, duration, increment] = match
  const duration = Number(match[1]);
  const increment = match[2];

  if (increment === 'w' && duration > 5) {
    // Rough estimate of months - SurrealDB durations only use weeks, not months
    const numMonths = Math.floor((duration * 7) / 30);
    return formatIncrement(numMonths, 'month');
  }
  // if (increment === 's') {
  //   return 'just now';
  // }
  return formatIncrement(duration, increment);
}

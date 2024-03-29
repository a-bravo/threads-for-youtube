/**
 * @file Various util functions
 */

// Constants

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const MONTH = 2629746;
const YEAR = 31556952;

/**
 * Pluralizes the unit based on amount
 *
 * @param {Number} amount The amount of units
 * @param {String} unit The unit of measurement
 * @param {String} [pluralUnit] The plural version of the unit (use for non-regular nouns)
 *
 * @returns {String} Pluralized unit
 */
export function pluralize(amount, unit, pluralUnit = `${unit}s`) {
  if (amount === 1) {
    return unit;
  }

  return pluralUnit;
}

/**
 * Formats the relative time
 * Makes utc timestamps human readable
 *
 * @param {Number} now  The current time in ms
 * @param {Number} time The utc value
 *
 * @returns {String} The formatted relative time
 */
export function timeAgo(now, time) {
  const timeElapsed = now / 1000 - Number(time);
  let readableTime;
  let unit;

  if (timeElapsed < MINUTE) {
    return 'just now';
  }

  if (timeElapsed < HOUR) {
    readableTime = Math.floor(timeElapsed / MINUTE);
    unit = pluralize(readableTime, 'minute');
  } else if (timeElapsed < DAY) {
    readableTime = Math.floor(timeElapsed / HOUR);
    unit = pluralize(readableTime, 'hour');
  } else if (timeElapsed < MONTH) {
    readableTime = Math.floor(timeElapsed / DAY);
    unit = pluralize(readableTime, 'day');
  } else if (timeElapsed < YEAR) {
    readableTime = Math.floor(timeElapsed / MONTH);
    unit = pluralize(readableTime, 'month');
  } else {
    readableTime = Math.floor(timeElapsed / YEAR);
    unit = pluralize(readableTime, 'year');
  }

  return `${readableTime} ${unit} ago`;
}

/**
 * Convert timestamp to HH:MM:SS format
 *
 * @param {Number} timestamp The value, in seconds, to format
 *
 * @returns {String} The formatted string
 */
export function toHHMMSS(timestamp) {
  const hours = Math.floor(timestamp / HOUR);
  const minutes = Math.floor((timestamp % HOUR) / MINUTE);
  const seconds = Math.round(timestamp % MINUTE);

  let result = hours === 0 ? '' : `${hours}:`;
  result += minutes > 9 ? `${minutes}:` : `0${minutes}:`;
  result += seconds > 9 ? `${seconds}` : `0${seconds}`;

  return result;
}

/**
 * Convert formatted time string to time in seconds
 * Format: XhXmXs or X (seconds)
 *
 * @param {String} timeStr The value, in seconds, to format
 *
 * @returns {Number} The time in seconds
 */
export function parseFormattedTime(timeStr) {
  const hours = parseInt(timeStr.match(/(\d*)h/g), 10) || 0;
  const minutes = parseInt(timeStr.match(/(\d*)m/g), 10) || 0;
  const seconds = parseInt(timeStr.match(/(\d*)s|^\d+$/g), 10) || 0;

  return hours * HOUR + minutes * MINUTE + seconds;
}

/**
 * Abbreviates a number with k, m, b suffixes
 *
 * @param {Number} n The value to abbreviate
 *
 * @returns {String} The abbreviated string
 */
export function abbreviateNumber(n) {
  if (n < 1e3) return `${n}`;
  if (n >= 1e3 && n < 1e6) return `${(n / 1e3).toFixed(1)}k`;
  if (n >= 1e6 && n < 1e9) return `${(n / 1e6).toFixed(1)}m`;
  return `${(n / 1e9).toFixed(1)}b`;
}

/**
 * @file Makes utc timestamps human readable
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
 *
 * @param {Number} time The utc value
 *
 * @returns {String} The formatted relative time
 */
export function timeAgo(time) {
  const timeElapsed = Date.now() / 1000 - Number(time);
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

  return `${readableTime} ${unit}`;
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

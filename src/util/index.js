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
 * @param {String} [message] A message to add to the output
 *
 * @returns {String} Pluralized string
 */
export function pluralize(amount, unit, pluralUnit = `${unit}s`, message = '') {
  if (amount === 1) {
    return `${amount}${message} ${unit}`;
  }

  return `${amount}${message} ${pluralUnit}`;
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

  if (timeElapsed < MINUTE) {
    readableTime = 'just now';
  } else if (timeElapsed < HOUR) {
    readableTime = pluralize(Math.floor(timeElapsed / MINUTE), 'minute');
  } else if (timeElapsed < DAY) {
    readableTime = pluralize(Math.floor(timeElapsed / HOUR), 'hour');
  } else if (timeElapsed < MONTH) {
    readableTime = pluralize(Math.floor(timeElapsed / DAY), 'day');
  } else if (timeElapsed < YEAR) {
    readableTime = pluralize(Math.floor(timeElapsed / MONTH), 'month');
  } else {
    readableTime = pluralize(Math.floor(timeElapsed / YEAR), 'year');
  }

  return readableTime;
}

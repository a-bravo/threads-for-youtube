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
 * Pluralizes the unit of time
 * @private
 *
 * @param {int} time The amount of time
 * @param {string} unit The unit of time
 * @returns {string} Pluralized string
 */
function pluralize(time, unit) {
  if (time === 1) {
    return `${time} ${unit}`;
  }

  return `${time} ${unit}s`;
}

/**
 * Formats the relative time
 *
 * @param {int} time The utc value
 * @returns {string} The formatted relative time
 */
export default function timeAgo(time) {
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

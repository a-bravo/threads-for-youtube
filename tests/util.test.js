import {
  timeAgo,
  pluralize,
  abbreviateNumber,
  parseFormattedTime,
  toHHMMSS,
} from '../src/util';

// Constants

const MINUTE = 60;
const YEAR = 31556952;

describe('timeAgo', () => {
  test('just now', () => {
    expect(timeAgo(Date.now() / 1000)).toBe('just now');
    expect(timeAgo(Date.now() / 1000 - MINUTE + 10)).toBe('just now');
  });

  test('singular time units ', () => {
    expect(timeAgo(Date.now() / 1000 - MINUTE - 10)).toBe('1 minute');
  });

  test('plural time units ', () => {
    expect(timeAgo(Date.now() / 1000 - (MINUTE * 4))).toBe('4 minutes');
  });

  test('a long long time ago', () => {
    expect(timeAgo(Date.now() / 1000 - (YEAR * 40))).toBe('40 years');
  });
});

describe('pluralize', () => {
  test('singular', () => {
    expect(pluralize(1, 'second')).toBe('second');
    expect(pluralize(1, 'comment')).toBe('comment');
  });

  test('plural', () => {
    expect(pluralize(3, 'hour')).toBe('hours');
    expect(pluralize(0, 'post')).toBe('posts');
  });

  test('passed in plurals', () => {
    expect(pluralize(3, 'child', 'children')).toBe('children');
    expect(pluralize(1, 'child', 'children')).toBe('child');
    expect(pluralize(2, 'deer', 'deer')).toBe('deer');
  });
});

describe('abbreviateNumber', () => {
  test('generic tests', () => {
    expect(abbreviateNumber(0)).toBe('0');
    expect(abbreviateNumber(999)).toBe('999');
    expect(abbreviateNumber(1000)).toBe('1.0k');
    expect(abbreviateNumber(999000)).toBe('999.0k');
    expect(abbreviateNumber(1000000)).toBe('1.0m');
  });

  test('handles rounding at thresholds', () => {
    expect(abbreviateNumber(9999)).toBe('10.0k');
    expect(abbreviateNumber(99999)).toBe('100.0k');
    expect(abbreviateNumber(999990)).toBe('1000.0k');
  });
});

describe('toHHMMSS', () => {
  test('base tests', () => {
    expect(toHHMMSS(0)).toBe('00:00');
    expect(toHHMMSS(11)).toBe('00:11');
    expect(toHHMMSS(MINUTE)).toBe('01:00');
    expect(toHHMMSS(MINUTE * 60)).toBe('1:00:00');
  });
});

describe('parseFormattedTime', () => {
  test('base tests', () => {
    expect(parseFormattedTime('2m30s')).toBe(150);
    expect(parseFormattedTime('9001s')).toBe(9001);
    expect(parseFormattedTime('9001')).toBe(9001);
    expect(parseFormattedTime('1h1m')).toBe(MINUTE * 60 + MINUTE);
    expect(parseFormattedTime('1h1s')).toBe(MINUTE * 60 + 1);
    expect(parseFormattedTime('1m1s')).toBe(MINUTE + 1);
  });

  test('handle bad input', () => {
    expect(parseFormattedTime('badinputs')).toBe(0);
  });
});

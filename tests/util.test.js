import { timeAgo, pluralize } from '../src/util';


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

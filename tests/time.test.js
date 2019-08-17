import timeAgo from '../src/util/time';


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

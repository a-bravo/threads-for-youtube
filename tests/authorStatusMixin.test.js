import authorStatusMixin from '../src/mixins/authorStatusMixin';
import { YT_LINK_CLASS } from '../src/constants';


describe('authorStatusMixin', () => {
  describe('authorClass', () => {
    test.each([
      [undefined, undefined, YT_LINK_CLASS],
      [undefined, true, 'op'],
      [null, true, 'op'],
      ['moderator', undefined, 'moderator'],
      ['moderator', true, 'moderator'],
      ['admin', undefined, 'admin'],
      ['special', true, 'special'],
    ])(
      'when distinguished: %s, isSubmitter: %s',
      (a, b, expected) => {
        expect(authorStatusMixin.methods.authorClass(a, b)[expected]).toBe(true);
      },
    );
  });

  describe('getAuthorStatus', () => {
    test.each([
      [null, true, '[S]'],
      ['moderator', true, '[S,M]'],
      ['moderator', false, '[M]'],
      ['admin', false, '[A]'],
      ['admin', undefined, '[A]'],
      ['admin', true, '[S,A]'],
      ['special', false, '[Δ]'],
      ['special', true, '[S,Δ]'],
      ['other', true, '[S]'],
      ['other', false, ''],
      [undefined, undefined, ''],
    ])(
      'when distinguished: %s, isSubmitter: %s',
      (a, b, expected) => {
        expect(authorStatusMixin.methods.getAuthorStatus(a, b)).toBe(expected);
      },
    );
  });
});

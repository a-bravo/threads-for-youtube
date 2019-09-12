import { shallowMount } from '@vue/test-utils';
import Options from '../src/options/Options.vue';
import { OPTIONS } from '../src/constants';


// Constants

const browser = {
  storage: {
    sync: {
      set: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({}),
    },
  },
};
const mocks = { $browser: browser };

const titleMessage = 'AlienTube Settings';


describe('Options', () => {
  // mount component
  const wrapper = shallowMount(Options, { mocks });

  describe('init', () => {
    test('is a Vue isntance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct default data', () => {
      expect(wrapper.vm.options).toStrictEqual(OPTIONS);
    });

    test('renders the correct markup at init', () => {
      expect(wrapper.html()).toContain(titleMessage);
      expect(wrapper.findAll('input, select')).toHaveLength(Object.keys(OPTIONS).length);

      expect(wrapper.find('select').element.value).toBe(OPTIONS.DEFAULT_TAB);
      expect(parseInt(wrapper.findAll('select').at(1).element.value, 10)).toBe(OPTIONS.NUM_POSTS);
    });
  });

  describe('validate user input on textbox', () => {
    describe('POST_COMMENT_THRESHOLD', () => {
      const input = wrapper.findAll('input').at(1);

      describe('when changing to invalid value', () => {
        test('non-integer value', () => {
          input.element.value = 'fdsffdsf';
          input.trigger('change');

          expect(parseInt(input.element.value, 10)).toBe(OPTIONS.POST_COMMENT_THRESHOLD);
        });

        test('out of bounds value', () => {
          input.element.value = '-5';
          input.trigger('change');

          expect(input.element.value).toBe('0');
        });

        test('out of bounds value with non-integer characters', () => {
          input.element.value = '-3gdf';
          input.trigger('change');

          expect(input.element.value).toBe('0');
        });
      });

      describe('when changing to valid values', () => {
        test('positive', () => {
          input.element.value = '5';
          input.trigger('change');

          expect(input.element.value).toBe('5');
        });

        test('will trim whitespace', () => {
          input.element.value = '   ';
          input.trigger('change');

          expect(input.element.value).toBe('');
        });
      });
    });

    describe('COMMENT_SCORE_THRESHOLD', () => {
      const input = wrapper.findAll('input').at(2);

      describe('when changing to invalid value', () => {
        test('non-integer value', () => {
          input.element.value = 'fdsffdsf';
          input.trigger('change');

          expect(parseInt(input.element.value, 10)).toBe(OPTIONS.COMMENT_SCORE_THRESHOLD);
        });
      });

      describe('when changing to valid values', () => {
        test('positive', () => {
          input.element.value = '5';
          input.trigger('change');

          expect(input.element.value).toBe('5');
        });

        test('will trim whitespace', () => {
          input.element.value = '   ';
          input.trigger('change');

          expect(input.element.value).toBe('');
        });
      });
    });
  });
});

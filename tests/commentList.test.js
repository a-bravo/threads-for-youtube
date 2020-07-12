import { shallowMount } from '@vue/test-utils';
import CommentList from '../src/components/CommentList.vue';
import { OPTIONS } from '../src/constants';

const root = {
  data() {
    return {
      state: {
        submissionList: [],
        submissions: { 1: { comments: [], loading: true, error: false } },
        comments: {},
      },
      loadComments: jest.fn().mockResolvedValue({}),
      setSortAction: jest.fn(),
    };
  },
};

describe('CommentList', () => {
  // mount component
  const wrapper = shallowMount(CommentList, {
    propsData: {
      submission: { id: 1, name: 1 },
      options: OPTIONS,
    },
    parentComponent: root,
  });

  // submissions will have comments
  describe('initial state', () => {
    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(wrapper.vm.comments).toHaveLength(0);
      expect(wrapper.vm.options).toStrictEqual(OPTIONS);
    });

    test('renders correct markup', () => {
      expect(wrapper.contains('spinner-stub')).toBe(true);
      expect(wrapper.contains('submission-stub')).toBe(true);

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.findAll('comment-stub')).toHaveLength(0);
      expect(wrapper.contains('#sort-by')).toBe(false);
    });
  });

  test('renders correctly when loading new comments', () => {
    wrapper.vm.$root.$data.state.comments = {
      1: { data: { id: 1 }, kind: 'test' },
      2: { data: { id: 2 }, kind: 'test' },
    };
    wrapper.vm.$root.$data.state.submissions['1'].loading = false;
    wrapper.vm.$root.$data.state.submissions['1'].error = false;
    wrapper.vm.$root.$data.state.submissions['1'].comments = ['1', '2'];

    // present
    expect(wrapper.contains('submission-stub')).toBe(true);
    expect(wrapper.contains('ul')).toBe(true);
    expect(wrapper.findAll('comment-stub')).toHaveLength(2);
    expect(wrapper.contains('#sort-by')).toBe(true);
    expect(wrapper.find('select').element.value).toBe(OPTIONS.DEFAULT_COMMENTS_SORT);
  });

  describe('renders correctly on edge cases', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions['1'].loading = false;
      wrapper.vm.$root.$data.state.submissions['1'].error = false;
      wrapper.vm.$root.$data.state.submissions['1'].comments = [];
    });

    test('on api error', () => {
      wrapper.vm.$root.$data.state.submissions['1'].error = true;

      expect(wrapper.html()).toContain('Could not reach reddit.');

      expect(wrapper.contains('submission-stub')).toBe(true);
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.findAll('comment-stub')).toHaveLength(0);
    });

    test('on load no results', () => {
      expect(wrapper.html()).toContain('there doesn\'t seem to be anything here');

      expect(wrapper.contains('submission-stub')).toBe(true);
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.findAll('comment-stub')).toHaveLength(0);
    });
  });
});

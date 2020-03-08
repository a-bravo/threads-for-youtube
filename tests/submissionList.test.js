import { shallowMount } from '@vue/test-utils';
import SubmissionList from '../src/components/SubmissionList.vue';
import { OPTIONS, DEFAULT_POSTS_TIME } from '../src/constants';

const root = {
  data() {
    return {
      state: {
        submissionList: [],
        submissions: { loading: true, error: false, moreError: false },
        comments: {},
        nextSubmission: null,
        init: false,
      },
    };
  },
};

describe('SubmissionList', () => {
  // mount component
  const wrapper = shallowMount(SubmissionList, {
    propsData: {
      submissions: [],
      options: OPTIONS,
      numFilteredSubmissions: 0,
      sort: OPTIONS.DEFAULT_POSTS_SORT,
      time: DEFAULT_POSTS_TIME,
    },
    parentComponent: root,
  });

  describe('initial state', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = true;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.init = false;
      wrapper.setProps({ submissions: [] });
    });

    test('is a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    test('has the correct data', () => {
      expect(wrapper.vm.submissions).toHaveLength(0);
    });

    test('renders correct markup', () => {
      // present
      expect(wrapper.contains('spinner-stub')).toBe(true);

      // not present
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
      expect(wrapper.contains('.sort-by')).toBe(false);
    });

    test('correct markup on state.init', () => {
      wrapper.vm.$root.$data.state.init = true;

      expect(wrapper.contains('spinner-stub')).toBe(false);
      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
      expect(wrapper.contains('.sort-by')).toBe(false);
    });
  });

  describe('renders correctly on edge cases', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.init = false;
      wrapper.setProps({ submissions: [], numFilteredSubmissions: 0, time: DEFAULT_POSTS_TIME });
    });

    test('on api error', () => {
      wrapper.vm.$root.$data.state.submissions.error = true;

      expect(wrapper.html()).toContain('Could not reach reddit.');
      wrapper.find('a').trigger('click');
      expect(wrapper.emitted().reload.length).toBe(1);

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
      expect(wrapper.contains('.sort-by')).toBe(false);
    });

    test('on load no results', () => {
      expect(wrapper.html()).toContain('No posts.');

      expect(wrapper.contains('ul')).toBe(false);
      expect(wrapper.contains('more-button-stub')).toBe(false);
      expect(wrapper.contains('submission-stub')).toBe(false);
      expect(wrapper.contains('.sort-by')).toBe(false);

      // set time to value other than DEFAULT_POSTS_TIME (all)
      wrapper.setProps({ time: 'hour' });

      expect(wrapper.html()).toContain('No posts.');

      expect(wrapper.contains('.sort-by')).toBe(true);
      expect(wrapper.findAll('select-input-stub')).toHaveLength(1);
      expect(wrapper.vm.selectTime).toBe('hour');
    });

    describe('posts have been filtered', () => {
      test('with no unfiltered posts', () => {
        wrapper.setProps({ submissions: [], numFilteredSubmissions: 1 });
        expect(wrapper.html()).not.toContain('No posts.');
        expect(wrapper.html()).toContain('1 post filtered');

        expect(wrapper.contains('ul')).toBe(true);
        expect(wrapper.contains('.sort-by')).toBe(true);
        expect(wrapper.findAll('select-input-stub')).toHaveLength(2);
        expect(wrapper.contains('more-button-stub')).toBe(false);
        expect(wrapper.contains('submission-stub')).toBe(false);
      });

      test('with unfiltered posts', () => {
        wrapper.setProps({
          submissions: [{ data: { id: 1, num_comments: 10 } }],
          numFilteredSubmissions: 1,
        });
        expect(wrapper.html()).not.toContain('No posts.');
        expect(wrapper.html()).toContain('1 post filtered');

        expect(wrapper.contains('ul')).toBe(true);
        expect(wrapper.contains('.sort-by')).toBe(true);
        expect(wrapper.findAll('select-input-stub')).toHaveLength(2);
        expect(wrapper.vm.selectSort).toBe(OPTIONS.DEFAULT_POSTS_SORT);
        expect(wrapper.vm.selectTime).toBe(DEFAULT_POSTS_TIME);
        expect(wrapper.contains('more-button-stub')).toBe(false);
        expect(wrapper.findAll('submission-stub')).toHaveLength(1);
      });
    });
  });

  describe('renders correctly when adding submissions', () => {
    beforeEach(() => {
      wrapper.vm.$root.$data.state.submissions.loading = false;
      wrapper.vm.$root.$data.state.submissions.error = false;
      wrapper.vm.$root.$data.state.submissions.moreLoading = false;
      wrapper.vm.$root.$data.state.submissions.moreError = false;
      wrapper.vm.$root.$data.state.nextSubmission = null;
      wrapper.vm.$root.$data.state.init = false;
      wrapper.setProps({
        submissions: [
          { data: { id: 1, num_comments: 10 } },
          { data: { id: 2, num_comments: 5 } },
        ],
      });
    });

    test('few submissions', () => {
      expect(wrapper.findAll('submission-stub')).toHaveLength(2);
      expect(wrapper.contains('more-button-stub')).toBe(false);
    });

    describe('more submissions', () => {
      test('available to load', () => {
        wrapper.vm.$root.$data.state.nextSubmission = 'someId';

        expect(wrapper.findAll('submission-stub')).toHaveLength(2);
        expect(wrapper.contains('more-button-stub')).toBe(true);
        expect(wrapper.html()).toContain('load more posts');
        expect(wrapper.html()).not.toContain('(Could not reach reddit. Try again later.)');
      });

      test('error on load', () => {
        wrapper.vm.$root.$data.state.nextSubmission = 'someId';
        wrapper.vm.$root.$data.state.submissions.moreError = true;

        expect(wrapper.findAll('submission-stub')).toHaveLength(2);
        expect(wrapper.contains('more-button-stub')).toBe(true);
        expect(wrapper.html()).toContain('load more posts');
        expect(wrapper.html()).toContain('(Could not reach reddit. Try again later.)');
      });
    });
  });
});

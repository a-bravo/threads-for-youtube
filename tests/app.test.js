import { shallowMount } from '@vue/test-utils';
import App from '../src/App.vue';


// Constants

const browser = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
  },
};
const mocks = { $browser: browser };

const apiErrorMessage = 'Could not reach reddit. Try again later.';
const numThreadsMessage = (num) => {
  const message = 'reddit threads';
  return num !== undefined ? `${num} ${message}` : `... ${message}`;
};


describe('App', () => {
  // mount component
  const wrapper = shallowMount(App, { mocks });

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('has the correct default data', () => {
    expect(typeof App.data).toBe('function');
    expect(wrapper.vm.initState).toBe(true);
    expect(wrapper.vm.submissions).toHaveLength(0);
  });

  test('renders the correct markup at init', () => {
    expect(wrapper.contains('submission-list-stub')).toBe(false);
    expect(wrapper.html()).toContain(numThreadsMessage());
  });

  test('renders the correct markup after init', () => {
    wrapper.vm.initState = false;

    expect(wrapper.html()).toContain(numThreadsMessage(0));
    expect(wrapper.contains('submission-list-stub')).toBe(true);
  });

  test('renders the correct markup when submissions added', () => {
    wrapper.vm.initState = false;
    wrapper.vm.submissions = [{ id: 1 }, { id: 2 }];

    expect(wrapper.html()).toContain(numThreadsMessage(2));
    expect(wrapper.contains('submission-list-stub')).toBe(true);
  });

  test('renders the correct markup when api returns an error', () => {
    wrapper.vm.initState = false;
    wrapper.vm.submissions = [];
    wrapper.vm.apiError = true;

    expect(wrapper.html()).not.toContain(numThreadsMessage());
    expect(wrapper.html()).toContain(apiErrorMessage);
    expect(wrapper.contains('submission-list-stub')).toBe(true);
  });
});

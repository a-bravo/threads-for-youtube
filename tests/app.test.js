import App from '../src/App.vue';

test('App has the correct default data', () => {
  expect(typeof App.data).toBe('function');
  expect(App.data().message).toBe('Vue loaded');
});

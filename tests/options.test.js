import Options from '../src/options/Options.vue';

test('App has the correct default data', () => {
  expect(typeof Options.data).toBe('function');
  expect(Options.data().message).toBe('AlienTube Settings');
});

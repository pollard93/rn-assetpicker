/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
// setup-tests.js

import 'react-native';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import 'isomorphic-fetch';
import MockAsyncStorage from 'mock-async-storage';

// Mocks
const mockImpl = new MockAsyncStorage();
jest.mock('AsyncStorage', () => mockImpl);
jest.mock('NativeAnimatedHelper');
jest.mock('@react-native-community/cameraroll', () => ({
  getPhotos: async () => ({
    edges: [{
      node: {
        timestamp: 1522437259.365,
        group_name: 'All Photos',
        type: 'image',
        location: {
          speed: 0.5513811087502415,
          latitude: 37.76007833333333,
          longitude: -122.50956666666667,
          heading: 0,
          altitude: 4.583391486392184,
        },
        image: {
          filename: '',
          playableDuration: 0,
          isStored: true,
          width: 4032,
          uri: 'ph://CC95F08C-88C3-4012-9D6D-64A413D254B3/L0/001',
          height: 3024,
        },
      },
    }],
    page_info: {
      has_next_page: false,
    },
  }),
}));

/**
 * Set up DOM in node.js environment for Enzyme to mount to
 */
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

/**
 * Set up Enzyme to mount to DOM, simulate events,
 * and inspect the DOM in tests.
 */
Enzyme.configure({ adapter: new Adapter() });

/**
 * Ignore some expected warnings
 * see: https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 * see https://github.com/Root-App/react-native-mock-render/issues/6
 */
const originalConsoleError = console.error;
console.error = (message) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};

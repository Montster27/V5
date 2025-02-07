import '@testing-library/jest-dom';
import { jest, beforeEach, afterEach } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  },
  writable: true,
  configurable: true
});

// Mock window.fs
Object.defineProperty(window, 'fs', {
  value: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readdir: jest.fn(),
    mkdir: jest.fn(),
  },
  writable: true,
  configurable: true
});

// Setup local storage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
});

// Setup global jest functions
global.jest = jest;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
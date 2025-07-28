/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * jest.setup.ts – runs once before every test file
 * ------------------------------------------------
 * 1. Polyfills     (TextEncoder/Decoder, Streams, fetch)
 * 2. MSW test-server (start / reset / close)
 * 3. Ad-hoc component mocks
 * 4. Silence ResizeObserver warnings
 */

/* ---------- 1. Node streams → global  --------------------------- */
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web';

(globalThis as any).ReadableStream ??= ReadableStream;
(globalThis as any).WritableStream ??= WritableStream;
(globalThis as any).TransformStream ??= TransformStream;

/* TextEncoder/Decoder (needed by msw on some node versions) */
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

/* fetch for Node < 20 – harmless on 20+ */
import 'whatwg-fetch';

// ------------------------------------------------------------------
//  BroadcastChannel polyfill for MSW v2 + JSDOM
// ------------------------------------------------------------------
class DummyBroadcastChannel {
  constructor(_name: string) {}

  postMessage() {}

  close() {}
  onmessage = null as any;
}
(globalThis as any).BroadcastChannel ??= DummyBroadcastChannel;

/* ---------- 2. RTL helpers & MSW server ------------------------- */
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/* ---------- 3. Ad-hoc component mocks --------------------------- */
import * as React from 'react';

jest.mock(
  '@/components/ThreeBG',
  () => () => React.createElement('div', { 'data-testid': 'three-bg' }),
);

jest.mock('nanoid', () => ({ nanoid: () => 'xxx' }));

/* ---------- 4. Silent ResizeObserver warnings ------------------- */
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;

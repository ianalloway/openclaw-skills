const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'matrix-rain.js'), 'utf8');

function eventTarget(extra = {}) {
  const listeners = new Map();
  return Object.assign(extra, {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type) { for (const fn of listeners.get(type) || []) fn(); },
    listenerCount(type) { return listeners.get(type)?.size || 0; },
  });
}

function harness({ reduced = false, hidden = false, context = true, css = {} } = {}) {
  const frames = new Map();
  let nextFrame = 0;
  let draws = 0;
  const ctx = { clearRect() {}, fillRect() {}, fillText() { draws++; } };
  const canvas = { style: { display: '' }, getContext: () => context ? ctx : null };
  const motion = eventTarget({ matches: reduced });
  const document = eventTarget({
    readyState: 'complete', hidden,
    documentElement: { style: { setProperty() {} } },
    getElementById: () => canvas,
  });
  const window = eventTarget({ innerWidth: 280, innerHeight: 140, matchMedia: () => motion });
  vm.runInNewContext(source, {
    window, document, console,
    getComputedStyle: () => ({ getPropertyValue: name => css[name] || '' }),
    requestAnimationFrame: callback => { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  return { rain: window.MatrixRain, frames, window, document, motion, canvas,
    tick(time = 1000) {
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(time);
      return draws;
    },
  };
}

test('destroy cancels the first scheduled frame, including frame ID zero', () => {
  const h = harness();
  assert.equal(h.frames.size, 1);
  h.rain.destroy();
  assert.equal(h.frames.size, 0);
  assert.equal(h.tick(), 0);
});

test('repeated init keeps one loop and removes all listeners on teardown', () => {
  const h = harness();
  h.rain.init();
  h.rain.init();
  assert.equal(h.frames.size, 1);
  assert.equal(h.window.listenerCount('resize'), 1);
  assert.equal(h.document.listenerCount('visibilitychange'), 1);
  assert.equal(h.motion.listenerCount('change'), 1);
  h.rain.destroy();
  assert.equal(h.window.listenerCount('resize'), 0);
  assert.equal(h.document.listenerCount('visibilitychange'), 0);
  assert.equal(h.motion.listenerCount('change'), 0);
});

test('initial hidden tabs pause and resume without parallel loops', () => {
  const h = harness({ hidden: true });
  assert.equal(h.frames.size, 0);
  h.document.hidden = false;
  h.document.dispatch('visibilitychange');
  h.document.dispatch('visibilitychange');
  assert.equal(h.frames.size, 1);
  h.document.hidden = true;
  h.document.dispatch('visibilitychange');
  assert.equal(h.frames.size, 0);
});

test('reduced motion is honored initially and when changed at runtime', () => {
  const h = harness({ reduced: true });
  assert.equal(h.frames.size, 0);
  assert.equal(h.canvas.style.display, 'none');
  h.motion.matches = false;
  h.motion.dispatch('change');
  assert.equal(h.frames.size, 1);
  assert.equal(h.canvas.style.display, '');
  h.motion.matches = true;
  h.motion.dispatch('change');
  assert.equal(h.frames.size, 0);
});

test('a missing canvas context does not schedule work or attach listeners', () => {
  const h = harness({ context: false });
  assert.equal(h.frames.size, 0);
  assert.equal(h.window.listenerCount('resize'), 0);
  assert.doesNotThrow(() => h.rain.destroy());
});

test('invalid CSS speed falls back to a drawable animation', () => {
  for (const speed of ['0', '-1', 'not-a-number', 'Infinity']) {
    const h = harness({ css: { '--matrix-speed': speed } });
    assert.ok(h.tick() > 0, speed);
  }
});

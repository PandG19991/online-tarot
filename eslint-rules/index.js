/**
 * MysticDraw Custom ESLint Rules
 * Rules that catch bugs ESLint + react-hooks cannot detect:
 * - setTimeout/setInterval memory leaks
 * - GSAP animation leaks
 * - Transition layer click leaks
 */

const timeoutCleanup = require('./timeout-cleanup');
const gsapCleanup = require('./gsap-cleanup');
const pointerEventsTransition = require('./pointer-events-transition');

const plugin = {
  meta: {
    name: 'eslint-plugin-mysticdraw',
    version: '1.0.0',
  },
  rules: {
    'timeout-cleanup': timeoutCleanup,
    'gsap-cleanup': gsapCleanup,
    'pointer-events-transition': pointerEventsTransition,
  },
  configs: {
    recommended: {
      plugins: ['mysticdraw'],
      rules: {
        'mysticdraw/timeout-cleanup': 'error',
        'mysticdraw/gsap-cleanup': 'warn',
        'mysticdraw/pointer-events-transition': 'warn',
      },
    },
  },
};

module.exports = plugin;

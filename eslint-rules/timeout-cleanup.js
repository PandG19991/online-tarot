/**
 * @fileoverview Enforce clearTimeout/clearInterval for every setTimeout/setInterval
 * AST-based detection — no regex false positives.
 */

/** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<'missingClear'>} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'setTimeout/setInterval must be cleared to prevent memory leaks',
      recommended: 'error',
    },
    messages: {
      missingClear:
        '"{{name}}" is assigned from setTimeout/setInterval but never cleared — add clearTimeout/clearInterval',
    },
    schema: [],
  },

  create(context) {
    const timers = new Map(); // name -> { node, cleared: false }

    function markCleared(node) {
      const callee = node.callee;
      if (callee.type !== 'Identifier') return;
      if (callee.name !== 'clearTimeout' && callee.name !== 'clearInterval') return;

      const arg = node.arguments[0];
      if (arg && arg.type === 'Identifier') {
        const existing = timers.get(arg.name);
        if (existing) existing.cleared = true;
      }
    }

    return {
      // Detect: const timer = setTimeout(...)
      VariableDeclarator(node) {
        const init = node.init;
        if (!init || init.type !== 'CallExpression') return;

        const callee = init.callee;
        if (callee.type !== 'Identifier') return;
        if (callee.name !== 'setTimeout' && callee.name !== 'setInterval') return;

        const varName = node.id.type === 'Identifier' ? node.id.name : null;
        if (varName) {
          timers.set(varName, { node: node.id, cleared: false });
        }
      },

      // Detect: clearTimeout(timer) or clearInterval(timer)
      CallExpression(node) {
        markCleared(node);
      },

      // Also detect: timer && clearTimeout(timer)
      LogicalExpression(node) {
        if (node.operator !== '&&') return;
        if (node.right.type === 'CallExpression') markCleared(node.right);
      },

      // Report uncleared timers at end of file
      'Program:exit'() {
        for (const [name, info] of timers) {
          if (!info.cleared) {
            context.report({
              node: info.node,
              messageId: 'missingClear',
              data: { name },
            });
          }
        }
      },
    };
  },
};

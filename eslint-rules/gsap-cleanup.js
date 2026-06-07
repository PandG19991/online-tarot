/**
 * @fileoverview Enforce gsap tween/timeline cleanup in useEffect/useLayoutEffect
 * AST-based: checks if gsap call is inside a hook with a cleanup return.
 */

function isGsapCall(node) {
  if (node.type !== 'CallExpression') return false;
  const callee = node.callee;
  if (callee.type === 'MemberExpression') {
    const obj = callee.object;
    const prop = callee.property;
    if (obj.type === 'Identifier' && obj.name === 'gsap') {
      const method = prop.type === 'Identifier' ? prop.name : null;
      return ['to', 'from', 'fromTo', 'timeline'].includes(method);
    }
  }
  // Also catch timeline().to() chains
  if (callee.type === 'MemberExpression') {
    const method = callee.property.type === 'Identifier' ? callee.property.name : null;
    if (method === 'to' || method === 'from' || method === 'fromTo') {
      // Check if parent chain includes gsap.timeline()
      let current = callee.object;
      while (current.type === 'CallExpression') {
        if (current.callee.type === 'MemberExpression' &&
            current.callee.object.type === 'Identifier' &&
            current.callee.object.name === 'gsap' &&
            current.callee.property.type === 'Identifier' &&
            current.callee.property.name === 'timeline') {
          return true;
        }
        current = current.callee;
      }
    }
  }
  return false;
}

function isAssignedToVariable(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'VariableDeclarator') return true;
    if (parent.type === 'AssignmentExpression' && parent.left !== node) return true;
    if (parent.type === 'CallExpression') break;
    parent = parent.parent;
  }
  return false;
}

function findEnclosingHook(node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'CallExpression' && current.callee.type === 'Identifier') {
      const name = current.callee.name;
      if (name === 'useEffect' || name === 'useLayoutEffect') {
        return current;
      }
    }
    current = current.parent;
  }
  return null;
}

function hasCleanupReturn(hookNode) {
  if (!hookNode || hookNode.arguments.length < 1) return false;
  const callback = hookNode.arguments[0];
  if (callback.type !== 'ArrowFunctionExpression' && callback.type !== 'FunctionExpression') {
    return false;
  }
  const body = callback.body;
  if (body.type !== 'BlockStatement') return false;

  for (const stmt of body.body) {
    if (stmt.type === 'ReturnStatement' && stmt.argument) {
      const arg = stmt.argument;
      // () => { ... return () => { ... } }
      if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') {
        const cleanupBody = arg.body;
        if (cleanupBody.type === 'BlockStatement') {
          // Search for .kill() calls in cleanup function body
          for (const cleanupStmt of cleanupBody.body) {
            if (findKillCall(cleanupStmt)) return true;
          }
        }
        // () => { ... return () => tl.kill() }  (single expression)
        if (cleanupBody.type === 'CallExpression') {
          if (isKillCall(cleanupBody)) return true;
        }
      }
    }
  }
  return false;
}

function isKillCall(node) {
  if (node.type !== 'CallExpression') return false;
  const callee = node.callee;
  if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
    return callee.property.name === 'kill';
  }
  return false;
}

function findKillCall(node) {
  if (!node) return false;
  if (isKillCall(node)) return true;
  // Recursively search child nodes
  for (const key of Object.keys(node)) {
    const child = node[key];
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (findKillCall(item)) return true;
        }
      } else if (child.type) {
        if (findKillCall(child)) return true;
      }
    }
  }
  return false;
}

/** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<'missingGsapCleanup'>} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'gsap animations must be killed on unmount to prevent memory leaks',
      recommended: 'error',
    },
    messages: {
      missingGsapCleanup:
        'gsap.{{method}}() without cleanup — store ref and kill() in useEffect return',
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        if (!isGsapCall(node)) return;

        // Skip if assigned to variable (user manages cleanup manually)
        if (isAssignedToVariable(node)) return;

        // Check if inside useEffect/useLayoutEffect with cleanup
        const hook = findEnclosingHook(node);
        if (hook && hasCleanupReturn(hook)) return;

        // Determine method name for message
        let method = 'animate';
        const callee = node.callee;
        if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
          method = callee.property.name;
        }

        context.report({
          node,
          messageId: 'missingGsapCleanup',
          data: { method },
        });
      },
    };
  },
};

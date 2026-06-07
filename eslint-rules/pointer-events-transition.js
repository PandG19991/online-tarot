/**
 * @fileoverview Scene transition layers with opacity must have pointer-events-none
 * Prevents clicks leaking through invisible animated layers.
 */

function hasPointerEventsNone(node) {
  // Check JSX attributes for className containing pointer-events-none
  if (node.type !== 'JSXOpeningElement') return false;
  for (const attr of node.attributes) {
    if (attr.type !== 'JSXAttribute') continue;
    if (attr.name.type !== 'JSXIdentifier') continue;
    const name = attr.name.name;
    if (name === 'className') {
      const value = attr.value;
      if (value && value.type === 'Literal' && typeof value.value === 'string') {
        if (value.value.includes('pointer-events-none')) return true;
      }
      if (value && value.type === 'JSXExpressionContainer') {
        const expr = value.expression;
        if (expr.type === 'Literal' && typeof expr.value === 'string') {
          if (expr.value.includes('pointer-events-none')) return true;
        }
        // Template literal or expression
        const source = context.getSourceCode().getText(expr);
        if (source.includes('pointer-events-none')) return true;
      }
    }
    // style={{ pointerEvents: 'none' }}
    if (name === 'style') {
      const source = context.getSourceCode().getText(attr);
      if (source.includes('pointerEvents') || source.includes('pointer-events')) return true;
    }
  }
  return false;
}

let contextRef = null;

/** @type {import('@typescript-eslint/utils').TSESLint.RuleModule<'missingPointerEvents'>} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Transition layers with opacity must block pointer events',
      recommended: 'error',
    },
    messages: {
      missingPointerEvents:
        'Scene transition layer with opacity needs pointer-events-none to prevent click leaks',
    },
    schema: [],
  },

  create(context) {
    contextRef = context;
    return {
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const attrName = node.name.name;
        if (attrName !== 'style' && attrName !== 'className') return;

        const value = node.value;
        if (!value) return;

        const source = context.getSourceCode().getText(value);

        // Only flag scene transition related elements
        const parentEl = node.parent;
        if (parentEl.type !== 'JSXOpeningElement') return;
        const parentSource = context.getSourceCode().getText(parentEl);

        // Only flag actual scene transition layers (not CSS transition classes)
        const isTransitionLayer =
          parentSource.includes('exiting') ||
          parentSource.includes('entering');

        if (!isTransitionLayer) return;

        // Check if opacity is present (style prop or inline)
        const hasOpacity = source.includes('opacity');
        if (!hasOpacity) return;

        // Check if pointer-events-none is present
        const hasPointerEvents =
          parentSource.includes('pointer-events-none') ||
          source.includes('pointerEvents') ||
          source.includes('pointer-events');

        if (!hasPointerEvents) {
          context.report({
            node,
            messageId: 'missingPointerEvents',
          });
        }
      },
    };
  },
};

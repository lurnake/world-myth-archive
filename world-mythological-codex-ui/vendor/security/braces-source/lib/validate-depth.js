'use strict';

// Local mitigation for GHSA-vfj7-8cjw-p6xm. Ignore parser back-references
// (parent/prev), and bound work before entering any recursive AST walker.
module.exports = ast => {
  const pending = [[ast, 0]];
  const seen = new WeakSet();
  let count = 0;
  while (pending.length) {
    const [node, depth] = pending.pop();
    if (!node || typeof node !== 'object') continue;
    if (depth > 128 || ++count > 131072 || seen.has(node)) {
      throw new SyntaxError('Brace AST exceeds safe depth or contains a cycle');
    }
    seen.add(node);
    if (Array.isArray(node.nodes)) {
      if (node.nodes.length > 131072 - count) throw new SyntaxError('Brace AST exceeds safe size');
      for (const child of node.nodes) pending.push([child, depth + 1]);
    }
  }
};

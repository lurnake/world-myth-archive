import test from 'node:test';
import assert from 'node:assert/strict';
import braces from 'braces';

test('normal patterns and glob integration remain compatible', () => {
 assert.deepEqual(braces.expand('a/{b,c}/{1..3}'), ['a/b/1','a/b/2','a/b/3','a/c/1','a/c/2','a/c/3']);
 assert.equal(braces.compile('a/{b,c}/d'), 'a/(b|c)/d');

 assert.equal(braces.stringify(braces.parse('a/{b,c}')), 'a/{b,c}');
});
test('all public walkers reject nested patterns before stack exhaustion', () => {
 for (const method of ['parse','compile','expand','stringify']) {
  for (const pattern of ['{'.repeat(10000)+'x'+'}'.repeat(10000), '{'.repeat(10000), '('.repeat(10000)]) {
   assert.throws(() => braces[method](pattern), SyntaxError);
  }
 }
});
test('direct AST inputs cannot bypass guards', () => {
 let ast={type:'text',value:'a'};
 for(let i=0;i<10000;i++) ast={type:'brace',nodes:[ast]};
 for(const method of ['compile','expand','stringify']) assert.throws(()=>braces[method](ast), SyntaxError);
 const cycle={type:'brace',nodes:[]};cycle.nodes.push(cycle);
 for(const method of ['compile','expand','stringify']) assert.throws(()=>braces[method](cycle), SyntaxError);
});

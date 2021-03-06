import * as t from 'assert';
import { parseScript, recovery, parseModule } from '../../../src/escaya';

describe('Statements - While', () => {
  // Invalid cases
  for (const arg of [
    'while ((',
    'while(/a/ { ',
    'while(/a/  /b/ ',
    'while (/}',
    'while(x=}',
    'while(x=)=y) {}',
    'while((x=(y,i,o..y))) {}',
    'while/("',
    'while\nx;',
    'while\n/x/g',
    'while(y)',
    'while\n',
    'while',
    'while(0) !function(){ continue; };',
    'while(0) { function f(){ continue; } }',
    'while(0) { function f(){ break; } }',
    'while(0) label: function f(){}',
    'while (;;) function * f() {}',
    'while(0) !function(){ break; };',
    'while (false) label1: label2: function f() {}',
    'while({1}){ break ; };',
    'while (false) let x = 1;',
    'while (false) function f() {}',
    'while "string" break;',
    'while 1 break;',
    'while (true)',
    'while catch',
    'while(x=y) { new.target; }',
    'while({[a] = {}}) {}/x/',
    'with((x=(y,i,o..y))) {}',
    'while(x=y) { a/}',
    'while(x=y) { !y = typeof x; }',
    'while (function* () {} += x);',
    'while(x) { case y: {...x} }',
    'while(x) { case y: foo /a/ }',
    'while(x) { case y:{ class { x() {} } }}',
    'while({x=y}) { case y: [...a] }'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseScript(`${arg}`, { loc: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseModule(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        recovery(`${arg}`, 'recovery.js');
      });
    });
  }

  // Valid cases. Testing random cases to verify we have no issues with bit masks
  for (const arg of [
    'while (foo) bar;',
    'while (function* () {} === x);',
    'while ((/(?!$\\x92$)/gimy)){}',
    'while(/a/) { /b/ }',
    'while(/a/)  /b/ ',
    'while (n-- != 0) {}',
    'while (x < y - 1) {}',
    'while (/["-{-]/gmuy[true] >>>= (((2e308)))) {}',
    'while(x=y) { function a() {} }',
    'while (x < 10) { x++; y--; }',
    'while(x=y) { async function *a() {} }',
    'while(x=y) { async function *a() {} }',
    'while(x=y) { async function *a() { yield foo; await x;} }',
    'while(x=y) { a/b}',
    'while(x=y) { (x)(y)}',
    'while(x=y) { ++x; }',
    'while(x=y) { x--;}',
    'while(x=y) { !y === typeof x; }',
    'while(x=y) { new twitter(x); }',
    'while( {"a": x}) {}/x/',
    'while( {["a"]: x}) {}/x/'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseScript(`${arg}`, { loc: true });
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseModule(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        recovery(`${arg}`, 'recovery.js');
      });
    });
  }

  it('simple block', () => {
    t.deepEqual(parseScript('{}', { loc: true }), {
      type: 'Script',
      webCompat: true,
      directives: [],
      leafs: [
        {
          type: 'BlockStatement',
          leafs: [],
          start: 0,
          end: 2
        }
      ],
      start: 0,
      end: 2
    });
  });

  it('block with lexical', () => {
    t.deepEqual(parseScript('{let foo = bar;}', { loc: true }), {
      type: 'Script',
      webCompat: true,
      directives: [],
      leafs: [
        {
          type: 'BlockStatement',
          leafs: [
            {
              type: 'LexicalDeclaration',
              isConst: false,
              declarations: [
                {
                  type: 'LexicalBinding',
                  binding: {
                    type: 'BindingIdentifier',
                    name: 'foo',
                    start: 5,
                    end: 8
                  },
                  initializer: {
                    type: 'IdentifierReference',

                    name: 'bar',
                    start: 11,
                    end: 14
                  },
                  start: 5,
                  end: 14
                }
              ],
              start: 1,
              end: 15
            }
          ],
          start: 0,
          end: 16
        }
      ],
      start: 0,
      end: 16
    });
  });

  it('block wrapped in paren', () => {
    t.deepEqual(parseScript('({})', { loc: true }), {
      type: 'Script',
      webCompat: true,
      directives: [],
      leafs: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ParenthesizedExpression',
            expression: {
              type: 'ObjectLiteral',
              properties: [],
              start: 1,
              end: 3
            },
            start: 0,
            end: 4
          },
          start: 0,
          end: 4
        }
      ],
      start: 0,
      end: 4
    });
  });

  it('with ; separation', () => {
    t.deepEqual(parseScript('{};{};;;;{};', { loc: true }), {
      directives: [],
      end: 12,
      start: 0,
      leafs: [
        {
          end: 2,
          start: 0,
          leafs: [],
          type: 'BlockStatement'
        },
        {
          end: 3,
          start: 2,
          type: 'EmptyStatement'
        },
        {
          end: 5,
          start: 3,
          leafs: [],
          type: 'BlockStatement'
        },
        {
          end: 6,
          start: 5,
          type: 'EmptyStatement'
        },
        {
          end: 7,
          start: 6,
          type: 'EmptyStatement'
        },
        {
          end: 8,
          start: 7,
          type: 'EmptyStatement'
        },
        {
          end: 9,
          start: 8,
          type: 'EmptyStatement'
        },
        {
          end: 11,
          start: 9,
          leafs: [],
          type: 'BlockStatement'
        },
        {
          end: 12,
          start: 11,
          type: 'EmptyStatement'
        }
      ],
      type: 'Script',
      webCompat: true
    });
  });

  it('same level', () => {
    t.deepEqual(parseScript('{}{}{}', { loc: true }), {
      directives: [],
      end: 6,
      start: 0,
      leafs: [
        {
          end: 2,
          start: 0,
          leafs: [],
          type: 'BlockStatement'
        },
        {
          end: 4,
          start: 2,
          leafs: [],
          type: 'BlockStatement'
        },
        {
          end: 6,
          start: 4,
          leafs: [],
          type: 'BlockStatement'
        }
      ],
      type: 'Script',
      webCompat: true
    });
  });

  it('nested', () => {
    t.deepEqual(parseScript('{{}}', { loc: true }), {
      directives: [],
      end: 4,
      start: 0,
      leafs: [
        {
          end: 4,
          start: 0,
          leafs: [
            {
              end: 3,
              start: 1,
              leafs: [],
              type: 'BlockStatement'
            }
          ],
          type: 'BlockStatement'
        }
      ],
      type: 'Script',
      webCompat: true
    });
  });
});

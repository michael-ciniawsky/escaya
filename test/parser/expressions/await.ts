import * as t from 'assert';
import { parseScript, recovery } from '../../../src/escaya';

describe('Expressions - Await', () => {
  // Invalid cases
  for (const arg of [
    'async function f(){ let y = x => await x; }',
    'let f = () => (y=await foo) => y;',
    '5 + (await bar())',
    //'async x => async ((a = await b) => a - a / (async))',
    'function f(a = await b) {}',
    'async function f({a = await b}) {}',
    'async function f({a: b = await}) {}',
    'async function f(){  (await) => x  }',
    '(async function await() { })',
    'async function foo(await) { }',
    '{ (x = [await x]) }',
    'await a',
    //'async (...await) => 1',
    'async function g(){async function f(foo = [h, {m: t(await bar)}]){}    }',
    'let x = async function f(foo = [{m: t(await bar)}]){}',
    'let o = {f(foo = [{m: t(await bar)}]){}',
    'let x = async function *f(foo = [{m: t(await bar)}]){}',
    'async function f(foo = [{m: t(await bar)}]){}',
    'function *f(foo = [{m: t(await bar)}]){}',
    'async function *f(foo = [{m: t(await bar)}]){}',
    'class x {f(foo = await bar){}}',
    'class x {async f(foo = await bar){}}',
    'class x {*f(foo = await bar){}}',
    'let o = {f(foo = await bar){}}',
    'let o = {async f(foo = await bar){}}',
    'let x = function f(foo = await bar){}',
    'function *f(foo = await bar){}',
    'async function f(){  async (await) => x  }',
    'async function af() { var a = (x, await, y) => { }; }',
    // 'async function af() { var a = (x, y = await 0, z = 0) => { }; }',
    'class A { async get foo() {} }',
    'class A { async static staticAsyncMethod() {} }',
    'await a;',
    'await a[0];',
    'await o.p;',
    'a + await p;',
    'await p + await q;',
    'foo(await p, await q);',
    'var lambdaParenNoArg = await () => x < y;',
    'function call(foo=await bar){}',
    'function call(foo=await bar=10){}',
    'async function f(){ let y = x => await x; }',
    'let f = () => (y=await foo) => y;',
    //'function *f(){  async (await) => x  }',
    //'async function a(){     async (foo = +await bar) => {}     }',
    //'async await => 42',
    // 'async () => ([a = await b]) => x',
    // 'async (a, b = await 1) => {}',
    'async () => { await => { }; }',
    // 'async (foo = await bar);',
    // 'async (foo = await bar) => {}',
    //'async function x({await}) { return 1 }',
    '([x] = await bar) => {}',
    '({x} = await bar) => {}',
    'let x = async function f(foo = await bar){}',
    'let x = async function *f(foo = await bar){}',
    '(x=(await z)=y)',
    'async function f() {  class x{[await](a){}}}'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseScript(`${arg}`);
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
    'await +42',
    'function *f(foo = await){}',
    'class x {*f(foo = await){}}',
    'function *f(foo = await){}',
    'let x = function *f(foo = await){}',
    'let o = {*f(foo = await){}}',
    'class x {f(foo = await){}}',
    'function f(foo = await){}',
    'let x = function f(foo = await){}',
    'let o = {f(foo = await){}}',
    'function *f(foo = await){}',
    'let x = function *f(foo = await){}',
    'class x {*f(foo = await){}}',
    'let o = {*f(foo = await){}}',
    'class x {f(foo = await){}}',
    'function f(foo = await){}',
    'let x = function f(foo = await){}',
    'let o = {f(foo = await){}}',
    '({...await} = obj)',
    'result = [...{ x = await }] = y;',
    'let o = {*f(await){}}',
    'let o = {f(await){}}',
    `await
    / x`,
    `await
    / x / g`,
    'await/x',
    'x / await',
    'await / x',
    'a = (b, c)',
    'arguments = 42',
    'let o = {async *await(){}}',
    'let o = {async await(){}}',
    'await',
    'await()',
    'await[x]',
    'await = 16',
    'await - 25',
    'call(await())',
    'call(await[1])',
    'call(await.foo)',
    'function* foo() { var await = 1; return await; }',
    'var f = () => { var await = 1; return await; }',
    'var O = { method() { var await = 1; return await; } };',
    'var O = { method(await) { return await; } };',
    'var O = { *method() { var await = 1; return await; } };',
    'async function foo(a, b) { await a + await b };',
    'async function wrap() { (a = await b) };',
    'async function foo(a, b) { await a };',
    'var O = { *method(await) { return await; } };',
    `await => async.await[async = bar / (async + 1)]`,
    `await => async.await[async / (async => foo)]`,
    `await => async.await[async / (async => foo.bar)]`,
    `({ await: async })`,
    `await => async.await[async / (async = async(async, await, bar))]`,
    `f(x, await(y, z))`,
    `x(async () => { await y.x('foo'); });`,
    `async r => result = [...{ x = await x }] = y;`,
    `result = [...{ x = await }] = y;`,
    `{ (x = [await]) }`,
    `let y = async x => { await x; }`,
    `async ([a = await])`,
    `async ({await})`,
    'class x {*f(await){}}',
    'async(await)',
    'function *f(){  (await) => x  }',
    'function *f(){  foo(await)  }',
    'function *f(foo = await){}',
    'let x = function *f(foo = await){}',
    'let o = {*f(foo = await){}}',
    'class x {f(foo = await){}}',
    'class x {*f(foo = await){}}',
    '({ async* f(a, b, ...c) { await 1; } })',
    '({ async* f(a, b = 2) { await 1; } })',
    'function *await(){}',
    'class x {f(foo = await){}}',
    'class x {*f(foo = await){}}',
    'async function await(){}',
    '({ async* f(a, b) { await 1; } })',
    '({ async* f(a) { await 1; } })',
    '({ async* f(a, b, ...c) { yield 1; } })',
    '({ async* f(a, b = 2) { yield 1; } })',
    '({ async* f(a, b) { yield 1; } })',
    '({ async* f(a) { yield 1; } })',
    '(x = class A {[await](){}; "x"(){}}) => {}',
    `await;`,
    'class await {}',
    `function await(yield) {}`,
    `await => async`,
    `await => async.await[foo]`,
    `async function test() { await foo(); }`,
    `async function test() { await foo(); }`,
    `async ({await: a}) => 1`,
    `async function a() { let a = await import('./foo.js'); }`,
    `async function a() { try { let a = await import({ toString() { throw new Error('out'); } }); } catch (e) {} }`,
    `function x() { return async () => { return await new.target }; }`,
    `async function test() { try { if (!await internals.hasServiceWorkerRegistration(self.origin)) {} } catch(a) {} }`,
    `async function one(x) { await two(x); }`,
    `async function* x({y = (0x44FB6C6428574)}) { while (({} = ([]), {} = function (z) { while (((await))) ;}) => f = [, ]) {}}`,
    `async function* x() { let r = n * await asyncFact(n - 1); }`,
    `(async function x(y) { await 1; }).length`,
    `i = async function i() {
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      return j();
    };`,
    `async function h() { for await (let x of ["a"]) { Debugger(); } };`,
    `async function caught_reject() {
      try {
        await reject;
      } catch (e) {
        assertEquals("b", e);
      }
    }`,
    `async r => result = [...{ x = await x }] = y;`,
    `result = [...{ x = await }] = y;`,
    `class x {*f(await){}}`,
    `function *f(await){}`,
    `let x = function *f(await){}`,
    `let o = {*f(await){}}`,
    `class x {f(await){}}`,
    `function f(await){}`,
    `let o = {f(await){}}`,
    `function *f(){  foo(await)  }`,
    `function *f(){  (await) => x  }`,
    `async g => (x = [await y])`,
    `{ (x = [await]) }`,
    `class x {async await(){}}`,
    `async function await(){}`,
    `async function *await(){}`,
    `let o = {async await(){}}`,
    `function *await(){}`,
    `let x = function *await(){}`,
    `function await(){}`,
    `let o = {await(){}}`,
    `await / x`,
    `(x=(await)=y)=>z`,
    `function f(await) {}`,
    `function f({a = await}) {}`,
    `function f({a: b = await}) {}`,
    `let y = async x => { await x; }`,
    `await`,
    `await[x]`,
    `call(await[1])`,
    `async(await);`,
    `async function f(){ await await foo; }`,
    `async function f(){ new (await foo) }`,
    `function f() { var await = 10; var o = { await }; }`,
    `function f() { const await = 10; }`,
    `var O = { *method() { var await = 1; return await; } };`,
    `var asyncFn = async({ foo = 1 }) => foo;`,
    `function* foo() { var await = 1; return await; }`,
    `async function a(){     async ([y] = [{m: 5 + t(await bar)}]);     }`,
    `async function f() { await 3; }`,
    `async function a(){     async ({r} = await bar);     }`,
    `y = async x => await x`,
    `async function a(){     async ([v] = await bar);     }`,
    `async function a(){     async (foo = [{m: 5 + t(await bar)}]);     }`,
    `async (a = await)`,
    `async (await)`,
    `async (...await)`,
    `async ([a = await])`,
    `async ({await})`,
    'async ({a: b = await})',
    `async x => async (a = await b - a)`,
    `async x => async (a = await b - a / (async))`,
    `async x => async (a = await b - a / await(async))`,
    `async x => async ((a = await b) - a / (async))`,
    `async x => async ((a = b) => a - a / (await))`,
    `async x => async (a = await b)`,
    `async x => async ([a = await b])`,
    `async x => async ({a: b = await c})`,
    `await => x`,
    `(await) => x`,
    `(...await) => x`,
    `([a = await]) => x`,
    `({a = await}) => x`,
    `({await}) => x`,
    `({a: b = await}) => x`,
    `async function f() { class x{[x](a=await){}} }`,
    `async function a(){     async (foo = await bar);     }`,
    'var await = 1',
    'async(await)',
    '({ await: async })',
    'await => {}',
    'await => async',
    'await => async.await[foo]',
    'await => async.await[async = bar / (async + 1)]',
    'var asyncFn = async function() { await 1; };',
    'var asyncFn = async function withName() { await 1; };',
    'async function asyncFn() { await 1; }',
    'var O = { async method() { await 1; } }',
    'function f() { var await; }',
    'function f() { class await { } }',
    'function f() { var o = { await: 10 } }',
    'function f() { var o = { get await() { } } }',
    'function f() { var o = { *await() { } } }',
    'function f() { class C { *await() { } } }',
    'function* g() { var f = async(yield); }',
    'function* g() { var f = async(x = yield); }',
    'function foo() { var await = 1; return await; }',
    'function foo(await) { return await; }',
    `await`,
    `async ({a: b = await})`,
    `async (a = await)`,
    `async (await)`,
    'function f() { var await; }',
    'function f() { let await; }',
    'function f() { const await = 10; }',
    'function f() { function await() { } }',
    'function f() { function* await() { } }',
    'function f() { var fe = function await() { } }',
    'function f() { class await { } }',
    'function f() { var o = { await: 10 } }',
    'function f() { var o = { get await() { } } }',
    'function f() { var o = { *await() { } } }',
    'function f() { var await = 10; var o = { await }; }',
    'function f() { class C { await() { } } }',
    `i = async function i() {
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      await j();
      return j();
    };`,
    '({ async* f(a) { yield 1; } })',
    '(x = class A {[await](){}; "x"(){}}) => {}',
    `await;`,
    'class await {}',
    `function await(yield) {}`,
    `await => async`,
    `await => async.await[foo]`,
    'var await = 1',
    'async(await)',
    '({ await: async })',
    'await => {}',
    'await => async',
    'await => async.await[foo]',
    'await => async.await[async = bar / (async + 1)]',
    'var asyncFn = async function() { await 1; };',
    'var asyncFn = async function withName() { await 1; };',
    "var asyncFn = async () => await 'test';",
    'async function await() {}',
    'f(x, await(y, z))',
    'class X { static await(){} }',
    'x = await(y);',
    'class X { await() {} }',
    'await \n / x',
    'await \n / x / g',
    'class test{ async method (param){ await foo();  }  method2(){}  }',
    'async function test() { await foo(); }',
    'var a = async function test() { await foo(); }',
    'var test = async a => await test();',
    'let async = await;',
    'x = { await: false }',
    'y = async x => await x',
    'o = (await) => x',
    '(await) => x',
    'call(await)',
    'function f() { var await; }',
    'function call(foo=await){}',
    'function call(await){}',
    `var test = async a => await test();`,
    `({ async* f(a, b, ...c) { await 1; } })`,
    `async function f() {
        let { [await "a"]: a } = { a: 1 };
        return a;
      }`,
    `async function caught_reject() {
      try {
        await reject;
      } catch (e) {
        assertEquals("b", e);
      }
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseScript(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        recovery(`${arg}`, 'recovery.js');
      });
    });
  }
});

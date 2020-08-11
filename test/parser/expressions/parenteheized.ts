import * as t from 'assert';
import { parseScript, recovery } from '../../../src/escaya';

describe('Expressions - Parentheized', () => {
  // Invalid cases
  for (const arg of [
    '({foo: {x:y} += x})',
    '({x:y} += x)',
    '[] += a',
    '({async **f(){}})',
    '({*=f(){}})',
    '({async *=f(){}})'
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
    '({ a: obj.a } = {})',
    '({ a: this.a } = {})',
    '([...[][x]] = x);',
    '([...{}[x]] = x);',
    '({...{b: 0}.x} = {});',
    '({...[0].x} = {});',
    '({...{b: 0}[x]} = {});',
    '({...[0][x]} = {});',
    '({...[1][2]} = {});',
    `({a:b,...obj}) => {}`,
    `({a,...obj}) => {}`,
    '({   async *"foo"(){}   })',
    '({...a+b})',
    '({obj: x, ...a})',
    '({790: this})',
    '({"foo": this})',
    '({ a: 1, ...y, b: 1 })',
    '({ key: bar.foo + x })',
    '({ key: bar.foo = x })',
    '({ async: async.await + x })',
    '({ async: async??await + x })',
    '({ async: async?.await + x })',
    '({async x() {}, async *x() {}, get x() {}, set x(y) {}, set() {}, get() {}});',
    `({...obj} = {}) => {}`,
    `({a:b,...obj} = foo)`,
    `({...a, ...b})`,
    `({...a}=x)`,
    `({obj: x, ...a})`,
    '(a.b = {});',
    '({...[].x} = x);',
    '({...a[x]} = x);',
    '({...a.x} = x);',
    '({...[({...[].x} = x)].x} = x);',
    '({...a.x} = x);',
    '({...x.x, y})',
    '([target()[targetKey()]] = source())',
    '() => {([(x), y] = x)}',
    '([ (foo.bar) ] = {})',
    '([ (y) ]= z = {})',
    '([(({ x } = { x: 1 }) => x).a]= z = {})',
    '([(({ x } = { x: 1 }) => x).a] = z = {})',
    '([((x, y) => z).x]= z = {})',
    '([(x)] = {})',
    '([(x)]= z = {})',
    '([(x),,(y)] = {})',
    '([ (foo.bar) ]= z = {})',
    '([x.y = a] = ([x.y = a] = ([x.y = a] = z)))',
    '({...{}.x} = x);',
    '([...[].x] = x);',
    '([...[([...[].x] = x)].x] = x);',
    '([...{}.x] = x);',
    '({...[][x]} = x);',
    '({...[][x]} = x = y);',
    '({...[][x]} = x = (y));',
    '({...[][x]} = (x) = (y));',
    '({...{}[x]} = x);',
    '({...{}[x = (y)[z]]} = x);',
    '([...[({...{}[x = (y)[z]]} = x)][x]] = x);',
    '([...[][x]] = x);',
    '([...{}[x]] = x);',
    '({...{b: 0}.x} = {});',
    '({...{b: 0}[x]} = {});',
    '({...[0][x]} = {});',
    '({ x : [ y[z] = 10 ] = {} })',
    '([ x ])',
    '([ foo().x ])',
    '([ foo()[x] ])',
    '([ x.y ])',
    '([ x[y] ])',
    '([ { x } ])',
    '([ { x : y } ])',
    '([ { x : foo().y } ])',
    '([ { x : foo()[y] } ])',
    '([ { x : x.y } ])',
    '([ { x : x[y] } ])',
    '([ { x = 10 } = {} ])',
    '([ { x : y = 10 } = {} ])',
    '([ { x : foo().y = 10 } = {} ])',
    '([ { x : foo()[y] = 10 } = {} ])',
    '([ { x : x.y = 10 } = {} ])',
    '([ { x : x[y] = 10 } = {} ])',
    '([ [ x = 10 ] = {} ])',
    '([ [ foo().x = 10 ] = {} ])',
    '([ [ foo()[x] = 10 ] = {} ])',
    '({ x : y, ...z })',
    '({ x : y = 1, ...z })',
    '({...x})',
    '({a: [b = 1, c = 2][1]} = {a:[]});',
    '({a: [b = 1, c = 2].b} = {a:[]});',
    '({0: x, 1: x} = 0)',
    '({a:let} = 0);',
    '([[]]=0)',
    '({x: y = 0} = 1)',
    '({x: y = z = 0} = 1)',
    '({x: [y] = 0} = 1)',
    '((a,a),(a,a))',
    '((((((((((((((((((((((((((((((((((((((((a))))))))))))))))))))))))))))))))))))))))',
    '({ x : y } = z = {});',
    '({ x : foo()[y] } = z = {});',
    '({ x : { foo: foo().y } });',
    '[...{a}] = [{}]',
    '({x:z = 1, x1:y = 20} = {});',
    '(q, { x = 10 } = {});',
    '({ x } = { x: 3 });',
    '({ x = 10 } = {});',
    '([a ** b]);',
    '({a, b} = {a: 1, b: 2});',
    '({ident: [foo, bar].join(s)})',
    '({ident: {x}})',
    '({ident: {x:y}/x/g})',
    '(a / b);',
    '(new x);',
    '({ident: {x:y}**x})',
    '(foo + (bar + boo) + ding)',
    '({ident: {x: y}.join(z)})',
    '({ responseText: text } = res)',
    '(foo, [bar, baz] = doo);',
    '([ ...(a) ] = z = {});',
    '([ (foo.bar) ] = z = {});',
    '(1)',
    '[(a)] = 0',
    '([...x.y] = z)',
    '({123(){}})',
    '({123: expr})',
    '({[key](){}})',
    '({[key]: a.b} = c)',
    '({...key = x})',
    '({...key.prop} = x)',
    '({...key})',
    '([(x).foo = x] = x)',
    '(a = b)',
    '((((((((((x))))))))));',
    '({a:(b)} = 0)',
    '({a:(b.c)} = 0)',
    '({a:(b = 0)})',
    '([(x)] = z = {});',
    '([...{}.x] = x);',
    '([...[]] = x);',
    '({x = 1} = {});',
    '({ __proto__: x, __proto__: y } = {})',
    '({x:y} = {});',
    '({a:(b)} = 0)',
    '({a:(b) = 0} = 1)',
    '(typeof x)',
    '({web: true,  __proto__: x, __proto__: y});',
    '({a:(b.c)} = 0)',
    '({a:(b = 0)})',
    'delete (foo)',
    '({x, y = 1, z = 2} = {});',
    '({[foo()] : z} = z = {});',
    '({[foo()] : (z)} = z = {});',
    '({[foo()] : foo().bar} = z = {});',
    '({x: y} = 0)',
    '({x} = 0)',
    '({x, y = 1, z = 2} = {});',
    '({42 : x} = {})',
    '(async)=2',
    '({200:exp})',
    '({[foo]: x} = y)',
    '({[foo]: bar} = baz)',
    '(true)',
    '[(a) = 0] = 1',
    '[(a.b)] = 0',
    '([a]) => b;',
    '[{x: y.z}] = a',
    '(foo.x)',
    //'async ({x=z}, y) => x;',
    'async (foo = yield)',
    'delete ((foo) => foo)',
    '(delete /a/g.x);',
    '(...x) => x',
    'async("foo".bar);',
    '({...x=y});',
    '(4..x)()',
    '({ x = 123 } = a);',
    '({ x: y.z } = a)',
    '({ x: (y) } = a);',
    '(await = "foo")',
    '"use strict"; (await = "foo")',
    '(x, y, ...z) => foo',
    '({ a: (b) } = {})',
    '(async)=2',
    '({200:exp})',
    '[{x: y.z}]',
    '(x + foo)',
    '({a} + foo)',
    '(q, {a} + foo)',
    '(q, {...x.y} = z)',
    '(q, {...x=y});',
    '(q, {...x+=y});',
    '(q, [...x]);',
    '(q, [...x]) => x',
    '({...x.y} = z)',
    '({...x=y});',
    '({...x+=y});',
    '([...x]);',
    '([...x]) => x',
    '({...x+y});',
    '([...x+y]);',
    '([...x]);',
    '([...x=y]);',
    '(0, a)',
    '(a,a)',
    '({...x, ...y});',
    '({...x, y});',
    '({[x]:y} = z);',
    '({x} = y);',
    '([ foo()[x] = 10 ] = z = {});',
    '([ x.y = 10 ] = z = {});',
    '([ x[y] = 10 ] = z = {});',
    '([ [ foo()[x] = 10 ] = {} ] = z = {})',
    '([ [ x.y = 10 ] = {} ]= z = {})',
    '([ [ foo()[x] = 10 ] = {} ] = {})',
    '([ [ foo()[x] = 10 ] = {} ]= z = {})',
    '([ [ x[y] = 10 ] = {} ]= z = {})',
    '([ [ x.y = 10 ] = {} ] = {})',
    '({ x : [ foo().y ] }= z = {})',
    '({ x : [ foo()[y] ] }= z = {})',
    '({ x : [ y.z ] }= z = {})',
    '({ x : [ y.z ] } = {})',
    '([x.y = a] = ([x.y = a?.y] = ([x.y = a] = z)))',
    '([x.y = a] = ([x.y = a?.y] = ([x.y = a] = z)))',
    '([a]) => b;',
    '([a] = b) => c;',
    '([a=[b.c]=d]) => e;',
    '({...[][x, y]} = x)',
    '({...{}[x, y]} = z)',
    '({...[0][x]} = {})',
    '(a.a(b))',
    '(a.a(b,c))',
    '(a.a([]))',
    '(a=b)',
    '(a=b=c)',
    '(a=(b=c))',
    '((a??b.c)??a.b)',
    '((a??b))',
    '(a.a({}))',
    '(a,b)',
    '(a,b,c, 1,2,3)',
    '(a[b])',
    '(a[{}])',
    '(a[[]])',
    '(a[1])',
    '({...{}.x} = x);',
    '({...[0][x]} = {});',
    '((a))()',
    '({} = 0);',
    '({foo: true ** false});',
    '({ x: x } = a);',
    '({ x } = a);',
    'new c(x)(y)',
    '"use strict"; ({ x: a, x: b } = q);',
    `({
      a,
      a:a,
      a:a=a,
      [a]:{a},
      a:some_call()[a],
      a:this.a
    } = 0);`,
    'a = (b = c)',
    '({a:(b) = c})',
    '({a:(b) = 0} = 1)',
    '({a:(b) = c} = 1)',
    '([(x).foo,] = x)',
    '({ a: (b) } = {})',
    '(([a]))',
    '([a] = [])',
    '(([a] = []))',
    '(x--, y);',
    '((x));',
    '(++x);',
    '({} + 1);',
    '([] + 1);',
    '(q, {} + 1);',
    '(([(((null))), , (([(2).r = (((308)) ? this : (x)), aihgi] = ({}))), (8), (y)]))',
    '(q, [] + 1);',
    'async ([] + 1);',
    '(a(b,c))',
    '(a([]))',
    '(a({}))',
    '(a.a())',
    '([ foo()[x] ] = z = {})',
    '([ foo().x ] = z = {})',
    '([ foo().x ]= z = {})',
    '([ foo()[x] ] = {})',
    '([ x.y ]= z = {})',
    '([ foo()[x] ]= z = {})',
    '(x = (yield) = f) => {}',
    '([ x[y] ] = z = {})',
    '([ [ foo().x ] ]= z = {})',
    '([ x[y] ]= z = {})',
    '([ [ foo()[x] ] ]= z = {})',
    '([ [ foo()[x] ] ] = {})',
    '([ [ x.y ] ]= z = {})',
    '([ [ x[y] ] ]= z = {})',
    '([ foo().x = 10 ]= z = {})',
    '([ foo()[x] = 10 ]= z = {})',
    '([ x.y = 10 ]= z = {})',
    '([ foo()[x] = 10 ] = {})',
    '({a: 1, b: 1}, y = { ...x, b: 1 });',
    '({a: 1}, y = { a: 2, ...x });',
    '({a: 3}, y = { a: 2, ...x, a: 3 });',
    '({a: 1, b: 1}, y = { a:2, ...x, b: 1 });',
    '({a: 1, b: 1}, y = { ...x, ...z });',
    '({a: 2, b: 2}, y = { ...x, ...z, a:2, b: 2 });',
    '({a: 1, b: 1}, y = { a: 1, ...x, b: 2, ...z });',
    '({ a: 1 }, y = { ...x });',
    '({0: 0, 1: 1}, y = { ...[0, 1] });',
    '(x + y) >= z',
    '(x + y) <= z',
    '(x + y) != z',
    '(x + y) == z',
    '(x + y) == z',
    '(x) / y',
    '(/x/)',
    '(false)',
    '([{}]);',
    '([delete /a/.x]);',
    '([delete /a/g.x]);',
    '([void /=g/m.x]);',
    '([delete foo.bar]);',
    '({ x, y, ...z } = o)',
    '([...[][x]] = x)',
    '(a = 1, b = 2);',
    '([]())',
    '({}())',
    '([](a))',
    '({}(a))',
    '([](a,b))',
    '({}(a,b))',
    '(a())',
    '(a(b))',
    '([a.b] = x);',
    '(x--);',
    '([target()[targetKey(a=b)]] = x);',
    '([].length) = y',
    '([x].length) = y',
    '({}.length) = z',
    '({x: y}.length) = z',
    '({x});',
    '(2 * 3 ** 2, 18)',
    '(1, 2, 3, 4, 5)',
    '([...x=y])',
    '((((a))((b)()).l))()',
    '({...{}})',
    '({a:b,...obj} = foo)',
    '({1: x})',
    '({1: x}=1)',
    '({1: x}=null)',
    '({1: x})',
    '({1: x}=1)',
    '({1: x}=null)',
    '({a: b}=null)',
    '({[x]: 1})',
    '({a}=1)()',
    '({a:a}=1)()',
    `([...x.y] = z)`,
    `(z = [...x.y] = z) => z`,
    `([...x, ...y]);`,
    '([x, ...y]) => x',
    `([...x+=y]);`,
    `([...x=y]);`,
    `([...x]);`,
    '({1: ({}) / (1)});',
    '({1: ({}) ? (1) : [1]});',
    '({1: (x * y - z)});',
    '([arguments] = []);',
    '({})(a = b);',
    '({1: (x = x) });',
    '({ q } = { x = 10 } = {});',
    '({ x = 10 } = {})',
    '(q, { x = 10 } = {})',
    '({ a, b: x })',
    '(x = {eval})',
    '({eval} = x)',
    '({ async x() {} })',
    '({ async x() {} })',
    '({ async [foo]() {} })',
    '({ get 500() {} })',
    '({ set 500(b) {} })',
    '({ set [foo](d) {} })',
    '({a: {b} = 0}) => x',
    '({a: {b: c} = 0}) => x',
    '([x[y]] = z)',
    '(q, [x[y]] = z)',
    '({a: {arguments}.x} = {});',
    '({...{arguments}.x} = {});',
    '({a: (b) = 0})',
    '({a: (b.x) = 0})',
    '({a: (b) = 0} = 1)',
    '({a: (b.x) = 0} = 1)',
    '([...{a = b} = c])',
    '({a: {a: b.x} = 0})',
    '({a: {b: c} = 0})',
    '({a: {b} = 0})',
    '({set a(yield){}})',
    '({a: {b}})',
    '({a: {b}, c})',
    '({a: [b] = 0})',
    '({a: [b.x] = 0})',
    '({a: [b] = 0}) => x',
    '({...{b: 0}[x]} = {});',
    '({...{b: 0}.x} = {});',
    '([target()[targetKey()]] = x);',
    '({...x.x, y})',
    '({...x.x = y, y})',
    '({...x = y, y})',
    '([x.y = a] = z)',
    '([x.y = a] = ([x.y = a] = ([x.y = a] = z)))',
    '([{x = y}] = z)',
    '({..."x".x} = x);',
    '(a.b) += 1;',
    '(this.a) += 1;',
    '({...{}.x} = x);',
    '([...[].x] = x);',
    '([...[([...[].x] = x)].x] = x);',
    '({...[({...[].x} = x)].x} = x);',
    '({...[].x} = x);',
    '([...[]] = x);',
    '({...(a,b),c})',
    '([...{}.x] = x);',
    '({...a.x} = x);',
    '({..."x"[x]} = x);',
    '({...[][x]} = x);',
    '({...[][x]} = x = y);',
    '({...[][x]} = x = (y));',
    '({...[][x]} = (x) = (y));',
    '({...{}[x]} = x);',
    '({...{}[x = (y)[z]]} = x);',
    '({a: {x = y}} = z)',
    '([...[({...{}[x = (y)[z]]} = x)][x]] = x);',
    '([...[][x]] = x);',
    '([...{}[x]] = x);',
    '([...{}[x]] = "x");',
    '({...{b: 0}.x} = {});',
    '(let)[x].foo in x;',
    '({x: y.z} = b)',
    'foo({get [bar](){}, [zoo](){}});',
    'foo({[bar](){}, get [zoo](){}});',
    'foo({set [bar](c){}, [zoo](){}});',
    'foo({[bar](){}, set [zoo](e){}});',
    'a = (  b, c  )',
    '([...[].x] = x);',
    '({a:(b) = c})',
    '({a:(b) = 0} = 1)',
    '(x, y, ...z) => foo',
    '({ a: (b) } = {})',
    '(async)=2',
    '({200:exp})',
    '({a:(b) = c} = 1)',
    '({*ident(){}})',
    '({*[expr](){}})',
    '({*20(){}})',
    '(x=(await)=y)',
    '({[foo]: x} = y)',
    'x=x=x',
    '({"a b c": bar})',
    '(null)',
    '(x, /x/)',
    '(/x/g)',
    '({ a: {prop: 1}.prop } = {})',
    `({ async* f(a, b, ...c) { await 1; } })`,
    `({ await: async })`,
    '([(x())[y] = a,] = z);',
    '([(x())[y],] = z);',
    '({...(obj)} = foo),({...obj} = foo),({...obj.x} = foo),({...{}.x} = foo),({...[].x} = foo)',
    '({...await} = obj)',
    '({...yield} = obj)',
    '({ident: {x:y}/x})',
    '(async ());',
    '({ident: [foo, bar]/x/g})',
    '({ident: [foo, bar].join("")})',
    '({[x]: y}) => z;',
    '({[foo]: bar} = baz)',
    '([...x]);',
    '([...x]) => x',
    '(z = [...x.y] = z) => z',
    '(z = [...x.y]) => z',
    '({...obj.x} = foo)',
    '({...obj} = foo)',
    '({...x+y});',
    '({...x, ...y});',
    '({...x, y});',
    '(z = [...x.y]) => z',
    '([...x=y]);',
    '({ x : foo()[y] } = z = {});',
    '({ x : { foo: foo().y } });',
    '(await) = 1',
    '({a} = b,) => {}',
    '([x] = y,) => {}',
    '({a},) => {}',
    '([x],) => {}',
    '(obj[0]) = 1;',
    '({a:((((a1))))} = {a:20})',
    '({ set a([{b = 1}]){}, })',
    '({ get a() { super[1] = 2; } });',
    '({a:a1 = r1 = 44} = {})',
    '({a, a:a, a:a=a, [a]:{a}, a:b()[a], a:this.a} = 0);',
    '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
    'f = (argument1, [a,b,c])',
    '({[x]:y});',
    '({ident: [foo, bar] + x})',
    '({ident: {x: y}})',
    '([a / b]);',
    `([a
      /b/g]);`,
    '({...[a, b]})',
    '({...a})',
    '({...{a, b}})',
    '({...a} = x)',
    '({x: {}.length} = x);',
    '({x: {}.length});',
    'x({[a]:b});',
    'x({[a]:b, [15]:d});',
    'x({async foo(){}, bar(){}});',
    'x({foo(){}, async bar(){}});',
    'x({async "foo"(){}});',
    'x({async [foo](){}});',
    'x({foo(){}, *bar(){}});',
    'x({*foo(){}});',
    'x({*[foo](){}});',
    'x({*get(){}});',
    'x({*123(){}});',
    '({x: {x: y}.length} = x);',
    '({x: false});',
    '({x: function(){}});',
    '({x: typeof x});',
    '({x: void x});',
    '({x: x + y});',
    '({x: new x});',
    '({x: delete x.y});',
    '(a.b) = 1;',
    '(a) = 1;',
    '(a[b]) = 1;',
    '(a.b().c().d) = 1;',
    '(this.a) += 1;',
    '(this.a) = 1;',
    '(this[b]) = 1;',
    '([x, y] = z);',
    '({x, y} = z);',
    '([[x, y] = z]);',
    '(a.b) += 1;',
    '(a.b().c().d) += 1;',
    `([].x);`,
    '(delete foo.bar);',
    '({});',
    '([...[].x] = x)',
    '([...{}[x]] = x)',
    '([...{}.x] = x)',
    '({...[][x]} = x)',
    '({...[].x} = x)',
    '({...a.x} = x)',
    '({...{}[x]} = x)',
    '([...[].x] = x, [...[].x] = x)',
    '([...{}[x]] = x, [...{}[x]] = x)',
    '([...{}.x] = x, [...{}.x] = x)',
    '(x.foo)',
    '(x + foo)',
    '(x.foo = y)',
    '(typeof x)',
    '({ x : [ y[z] = 10 ] = {} }= z = {})',
    '({ x : [ y.z = 10 ] = {} }= z = {})',
    '({ x : [ foo()[y] = 10 ] = {} } = {})',
    '({ x : [ foo()[y] = 10 ] = {} }= z = {})',
    '({ x : [ foo().y = 10 ] = {} }= z = {})',
    '({ x : [ foo().y = 10 ] = {} } = z = {})',
    '({ x : [ y[z] ] }= z = {})',
    '({ x : [ y.z = 10 ] = {} } = {})',
    '([ [ foo().x = 10 ] = {} ]= z = {})',
    '([ x[y] = 10 ] = {})',
    '([ x[y] = 10 ]= z = {})',
    '([ [ foo().x = 10 ] = {} ] = z = {});',
    '([(x),,(y)] = z = {});',
    '([x,,...z] = z = {});',
    '([z, (y), z])',
    '({ y: x = 1 })',
    'c = ({b} = b);',
    '({b} = b);',
    '([b] = b);',
    '(a.b) = {}',
    '(f().a) = 1;',
    '(obj[0]) = 1;',
    '(obj.a) = 1;',
    '({a:((((a1))))} = {a:20})',
    '({a:a1 = r1 = 44} = {})',
    '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
    'f = (argument1, [a,b,c])',
    'f = (argument1, { x : x, y : y = 42 })',
    'f = (argument1, [{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]])',
    '(argument1, [a,b,...rest])',
    'f = ( {[x] : z} )',
    '(a, b, c, 1, 2, 3);',
    '({[x]:y});',
    `a = (
      b,
      c
    )`,
    '({ a, ...b } = c)',
    '({ a } = c)',
    '({a, ...b})',
    '(let.a) += 1;',
    '({0: y} = 0)',
    '({ ...c[0]})',
    '({ ...d.x })',
    '({ x: (y) = [] })',
    '({ x: (foo.bar) })',
    '([a = 1])',
    '({ x: (y) })',
    '({x, ...y} = {})',
    '(x + y);',
    '(null);',
    '(new x)',
    '(class{})',
    '(arguments)',
    '([{x:x, y:y, ...z}, [a,b,c]] = {})',
    '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
    '([{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {});',
    '([{x:x, y:y}, [a,b,c]])',
    '({[1+1] : z, ...x} = {})',
    '({arguments: x, ...z} = {});',
    '({a: {eval}.x} = {});',
    '({...{eval}.x} = {});',
    '({ a: 1 }).a === 1',
    '({ x : [ y = 10 ] = {} })',
    '({ x : [ foo().y = 10 ] = {} })',
    '({ x : [ foo()[y] = 10 ] = {} })',
    '({ x : [ y.z = 10 ] = {} })',
    '({ z : { __proto__: x, __proto__: y } = z })',
    '([a,,...rest] = {})',
    '({var: x = 42} = {})',
    '({x, ...y, a, ...b, c})',
    '([...[]] = x);'
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

  it('(a)', () => {
    t.deepEqual(parseScript('(a)', { loc: true }), {
      type: 'Script',
      directives: [],
      leafs: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ParenthesizedExpression',
            expression: {
              type: 'IdentifierReference',
              name: 'a',
              start: 1,
              end: 2
            },
            start: 0,
            end: 3
          },
          start: 0,
          end: 3
        }
      ],
      start: 0,
      end: 3
    });
  });

  it('(a, b)', () => {
    t.deepEqual(parseScript('(a, b)', { loc: true }), {
      type: 'Script',
      directives: [],
      leafs: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'ParenthesizedExpression',
            expression: {
              type: 'CommaOperator',
              expressions: [
                {
                  type: 'IdentifierReference',
                  name: 'a',
                  start: 1,
                  end: 2
                },
                {
                  type: 'IdentifierReference',
                  name: 'b',
                  start: 4,
                  end: 5
                }
              ],
              start: 0,
              end: 5
            },
            start: 0,
            end: 6
          },
          start: 0,
          end: 6
        }
      ],
      start: 0,
      end: 6
    });
  });
});

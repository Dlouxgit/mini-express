## Express 和 Koa 对比
- express 处理请求得时候全部采用回调函数得方式，koa 采用的是 Promise + async + await
- express 内部采用 es5， koa 采用 es6
- express 比 koa 功能多，多了一些内置的中间件（路由，静态服务，模板渲染）代码体积比 koa 多
- koa 中为了扩展采用的是 ctx 扩展了 request，response 对象，express 直接在原生的 req 和 res 的基础上进行了扩展
- express 中的特点是内部采用回调（组合 它内部不支持 promise 串联） koa 支持 promise 串联
- express 里既可以 express()，也可以 new express()，因为用的是 es5 的类的写法，而 koa 采用 class 只能使用 new koa()
- express 和 koa 是同一班人马打造


Layer 匹配路径，路径上可以对应的是 Route.dispatch（路由），或者 use（中间件） 的回调
Route 匹配方法，一个 Route 内存在又多个 Layer，但这些 Layer 只匹配方法名（get\post 等），同时 route 上会有属性标识这个 route 上有什么方法，暴露出来以供外部函数遍历时是否深入 Route 的 stack 继续遍历。
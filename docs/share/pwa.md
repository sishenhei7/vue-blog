# pwa

<!-- prettier-ignore-start -->
!!!include(docs/share/pwa/intro.md)!!!
<!-- prettier-ignore-end -->

## 介绍

1. 可靠：网络不稳定，也能瞬间加载和展现
2. 快速响应：用户操作后的响应非常快速
3. 粘性：像原生应用一样，沉浸式（可以添加到桌面，推送服务）

4. manifest
5. service worker
6. cache api
7. background services(Fetch && Sync)(后台同步)

## manifest

manifest 文件控制了当 web app 安装到移动端的时候，应该怎么表现。这是一个完整的 manifest.json 文件示例：

```
{
  "short_name": "Maps",
  "name": "Google Maps",
  "icons": [
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/icons-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/maps/?source=pwa",
  "background_color": "#3367D6",
  "display": "standalone", // fullscreen,standalone,minimal-ui,browser
  // "orientation": "landscape",
  "scope": "/maps/",
  "theme_color": "#3367D6"
}
```

```
<!-- index.html -->
<link rel="manifest" href="/manifest.json">

// 更改 theme-color 的 meta
<meta name="theme-color" content="#4285f4">
```

## service worker && cache 的简单使用

[实际操作案例](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0)

[案例地址]()

说明目的

实际体验一下 pwa 的缓存效果和基本操作

开始演示 1.注册 SW（self.skipWaiting 的使用） 2.离线页的使用（缓存离线页，判断请求来源，请求失败则跳转离线页） 3.储存静态资源，清除数据 4.缓存 app 请求

## service worker

2 个坑：

1. 虽然 SW 只能在 https 环境下运行，但是它也能在 localhost 或者 217.0.0.1 这个 host 下运行。
2. SW 是有作用域的，作用域是 SW 注册文件的放置目录。比如说如果项目主目录是 ./，然后 sw.js 的文件目录是 ./foo/sw.js，那么 SW 的作用域就是 foo，它只能处理 /foo/xxxx 这个域名下的 http 请求。(最佳实践：把 sw.js 放在主目录下面)

SW 的生命周期
1.install: 当 SW 下载完成之后，就会执行 install，安装 SW。注意，在这个阶段，SW 对页面是不起作用的，并不能代理 http 请求。
2.active: 当 SW 安装完成之后，并不会立即适用，它会在下次页面刷新或者打开的时候才会适用，所以初次打开页面的时候 SW 并不能代理 http 请求。如果这个时候页面已经有老的 SW，那么老的 SW 仍然会继续运行。
3.waiting: 在 install 和 active 之间 SW 是属于 waiting 阶段，这个严格来说并不是生命周期，因为它没有一个回调。

SW 的调试

## web push

[实际操作案例](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0)

[案例地址]()

说明目的

开始演示

工作原理：

1. 浏览器向服务端请求 web app。
2. 服务端返回 web app 给客户端，同时浏览器安装 SW。
3. 浏览器的 SW 向 google cloud 注册 push 功能。（需要翻墙）
4. google cloud 返回给浏览器 token。
5. 浏览器把 token 发送给 服务端。
6. 服务端给浏览器返回消息确认 token 已收到。
7. 当服务端需要进行 web push 的时候，把 push 内容发送给 google cloud，然后 google cloud 推送给浏览器。（需要翻墙）

## 应用

workbox

缓存策略：

1. StaleWhileRevalidate：同时从网络与缓存获取，如果缓存可用，取缓存数据，同时会把网络请求的数据缓存起来；否则从网络中请求，并更新缓存。
2. CacheFirst：优先取缓存中的数据，若没有则请求网络，请网络也失败就会报错。
3. NetworkFirst：优先从网络获取，若没有则从缓存中获取，缓存获取失败则报错。
4. CacheOnly：只从缓存中获取，若没有则报错。
5. NetworkOnly：只从网络获取，若没有则报错。

注意：对于跨域的资源请求，因为 workbox 无法检测跨域请求是否成功，如果失败，用户将无法获取响应数据，但是在 NetworkFirst 和 StaleWhileValidate 策略下，可以缓存跨域资源，因为这两个策略的缓存会定期更新，即便出现失败请求，缓存的时间也是短暂的，具体详情可以参考[Handling a Route with a Workbox Strategy](https://developers.google.com/web/tools/workbox/guides/route-requests)

结合 vue

[@vue/cli-plugin-pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa)

这个需要自己配置缓存策略。

结合 nuxt

[@nuxtjs/pwa](https://pwa.nuxtjs.org/)

它使用的默认缓存策略是：

1. 对 webpack 没有打包的资源(static 文件夹)：网络优先
2. 对 webpack 打包的资源(\_nuxt 文件夹)：缓存优先

结合我们的项目 1.官网项目：需要。 2.后台项目：api 请求是实时的，不需要；对于静态资源，可以考虑缓存 js，css 和 字体。

## 问题

1. iOS11.3 之前都不支持
2. 需要客户端使用的 GCM(Google Cloud Messaging) 需要翻墙
3. 微信小程序的竞争

## 参考资料

1.[讲讲 PWA](https://juejin.im/post/5a2de466f265da430b7b2dc9) 2.[Integrating Push Notifications in your Node/React Web App](https://medium.com/@jasminejacquelin/integrating-push-notifications-in-your-node-react-web-app-4e8d8190a52c#9a53) 3.[codelabs](https://codelabs.developers.google.com/?cat=Web) 4.[lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)

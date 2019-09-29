# PWA

## 介绍

> 说明，我只是简单介绍，并没有太深入，但深度还是有的

PWA 简称：Progressive Web App

<img width="80%" :src="$withBase('/pwa-overall.png')">

特点：

1. **可靠**：网络不稳定，也能瞬间加载和展现
2. **快速响应**：用户操作后的响应非常快速
3. **粘性**：像原生应用一样，沉浸式（可以添加到桌面，推送服务）

用的技术栈：

1. manifest.json
2. service worker
3. cache api
4. background services(Fetch && Sync)(后台同步)

## manifest 文件

<img width="80%" :src="$withBase('/pwa-manifest.png')">

manifest 文件控制了**当 web app 安装到移动端的时候，应该怎么表现**。这是一个完整的 manifest.json 文件示例：

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

下面是`name`参数的示例：
<img width="80%" :src="$withBase('/pwa-name.png')">

下面是`background-color`参数的示例：
<img :src="$withBase('/pwa-background-color.gif')">

下面是`theme-color`参数的示例：
<img :src="$withBase('/pwa-theme-color.png')">

下面是引入 `manifest` 文件的方法：

```
<!-- index.html -->
<link rel="manifest" href="/manifest.json">
```

当然我们也可以利用 `meta` 更改 `theme-color`:

```
// 更改 theme-color 的 meta
<meta name="theme-color" content="#4285f4">
```

## service worker

**SW 的生命周期**

下面是 SW 的生命周期：

1. **install**: 当 SW 下载完成之后，就会执行 install，安装 SW。注意，在这个阶段，SW 对页面是不起作用的，并不能代理 http 请求。
2. **active**: 当 SW 安装完成之后，并不会立即适用，它会在下次页面刷新或者打开的时候才会适用，所以初次打开页面的时候 SW 并不能代理 http 请求。如果这个时候页面已经有老的 SW，那么老的 SW 仍然会继续运行。
3. **waiting**: 在 install 和 active 之间 SW 是属于 waiting 阶段，这个严格来说并不是生命周期，因为它没有一个回调。

**下面是一个新的 SW 生命周期示意图：**
<img width="80%" :src="$withBase('/sw-new.gif')">

**下面是一个新的 SW 取代旧的 SW 的示意图：**
<img width="80%" :src="$withBase('/sw-old.gif')">

**service worker，简称 SW ，有 3 个坑：**

1. 虽然 SW 只能在`https`环境下运行，但是它也能在`localhost`或者`217.0.0.1`这个 host 下运行。
2. SW 是有**作用域**的，作用域是 SW 注册文件的放置目录。
3. SW 从下载到激活再到代理 http 请求是有**延迟性**的。

::: warning SW 的作用域
比如说如果项目主目录是 ./，然后 sw.js 的文件目录是 ./foo/sw.js，那么 SW 的作用域就是 foo，它只能处理 /foo/xxxx 这个地址下的 http 请求。(最佳实践：把 sw.js 放在主目录下面，即放到这个文件目录：./sw.js)。
:::

**SW 的调试**

参见我的具体操作。

## 简单制作 PWA

::: tip 说明目的
实际体验一下 pwa 的缓存效果和基本操作

1. 注册 SW（self.skipWaiting 的使用）
2. 缓存离线页（缓存离线页，判断请求来源，请求失败则跳转离线页）
3. 缓存 app 请求
4. SW 的延迟性
   :::

[教程文档](https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0)

[案例地址](http://localhost:8089/)

## web push

::: tip 说明目的
实际体验一下 web push 的实际 coding 过程 和原理

1. 浏览器向服务端请求 web app。
2. 服务端返回 web app 给客户端，同时浏览器安装 SW。
3. 浏览器的 SW 向 google cloud 注册 push 功能。（需要翻墙）
4. google cloud 返回给浏览器 token。
5. 浏览器把 token 发送给 服务端。
6. 服务端给浏览器返回消息确认 token 已收到。
7. 当服务端需要进行 web push 的时候，把 push 内容发送给 google cloud，然后 google cloud 推送给浏览器。（需要翻墙）
   :::

<img width="80%" :src="$withBase('/pwa-push.png')">

[教程文档](https://codelabs.developers.google.com/codelabs/push-notifications/#0)

[案例地址](http://localhost:8020/)

[push server 地址](https://web-push-codelab.glitch.me/)

## 实际应用

谷歌有一款插件叫做[workbox.js](https://developers.google.com/web/tools/workbox/)。它使用的**缓存策略**是：

1. **StaleWhileRevalidate**：同时从网络与缓存获取，如果缓存可用，取缓存数据，同时会把网络请求的数据缓存起来；否则从网络中请求，并更新缓存。
2. **CacheFirst(缓存优先)**：优先取缓存中的数据，若没有则请求网络，请网络也失败就会报错。
3. **NetworkFirst(网络优先)**：优先从网络获取，若没有则从缓存中获取，缓存获取失败则报错。
4. **CacheOnly(仅缓存)**：只从缓存中获取，若没有则报错。
5. **NetworkOnly(仅网络)**：只从网络获取，若没有则报错。

::: warning Vue 官方文档的刷新小窗原理
`workbox.js` 自己实现了很多钩子，其中就有`update`钩子(详细见文档[What is Broadcast Update?](https://developers.google.com/web/tools/workbox/modules/workbox-broadcast-update?hl=en))，这是专门针对**StaleWhileRevalidate**所做的钩子，因为这个缓存策略在使用缓存的时候，同时也会发出网络请求，请求最新数据，当所有的数据请求完成之后，它会判断新的缓存和旧的缓存是否有变动，如果有的话，就广播 update 事件。然后 Vue 官方文档监听了 update 事件，如果监听到了，就弹出小窗让我们刷新。
:::

### 官方插件

**Vue 官方** 对上面的 `workbox.js` 做了一定的封装，开发了 [@vue/cli-plugin-pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa) 插件，这个插件仅仅是做简单的封装而已，需要我们**自己配置缓存策略**。

**Nuxt 官方** 也对上面的 `workbox.js` 做了一定的封装，开发了[@nuxtjs/pwa](https://pwa.nuxtjs.org/) 插件，这个插件使用的**缓存策略**是：

1. 对 webpack 没有打包的资源(static 文件夹)：网络优先
2. 对 webpack 打包的资源(\_nuxt 文件夹)：缓存优先

### 结合我们的项目

1. 官网项目：需要，不解释。
2. 后台项目：api 请求是实时的，不需要；对于静态资源，可以考虑缓存 js，css 和 字体（但是有其它更好的储存方法）。

## 目前的困境

**PWA 虽然有这么棒的离线体验，但是它还没有得到广泛的运用，原因有以下几点：**

1. iOS11.3 之前都**不支持**
2. web push 需要客户端**翻墙**来连接 GCM(Google Cloud Messaging)
3. 微信小程序的**竞争**

## 参考资料

1. [讲讲 PWA](https://juejin.im/post/5a2de466f265da430b7b2dc9)
2. [Integrating Push Notifications in your Node/React Web App](https://medium.com/@jasminejacquelin/integrating-push-notifications-in-your-node-react-web-app-4e8d8190a52c#9a53)
3. [codelabs](https://codelabs.developers.google.com/?cat=Web)
4. [lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)

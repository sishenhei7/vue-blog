module.exports = {
  base: '/vue-blog/',
  title: 'Candybullet',
  description: 'blog',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    nav: genNav(),
    sidebar: {
      '/blog/': genBlogConfig()
    },
    lastUpdated: '上次更新',
    repo: 'sishenhei7/vue-blog',
    editLinks: true,
    docsRepo: 'sishenhei7/vue-blog',
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    sidebarDepth: 2
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public'
      }
    }
  },
  markdown: {
    config: md => {
      // 使用更多的 markdown-it 插件!
      md.use(require('markdown-it-include'))
    }
  }
}

function genNav() {
  return [
    {
      text: '首页',
      link: '/'
    },
    {
      text: '博客',
      link: '/blog/'
    },
    {
      text: '配置',
      link: '/config/'
    }
  ]
}

function genBlogConfig() {
  return [
    {
      title: 'blog',
      collapsable: true,
      displayAllHeaders: true,
      children: ['', 'frontEnd', 'reading']
    }
  ]
}

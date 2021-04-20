const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'FDK Single Page App Integrations',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'React',
        link: '/react/',
      },
      {
        text: 'Vue',
        link: '/vue/'
      },
      {
        text:'Feature Tracker',
        link:'/tracker/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '',
            'using-vue',
          ]
        }
      ],
      '/react/':[
        {
          title: 'React',
          collapsable: false,
          sidebarDepth: 4,
          children: [
            ''
          ]
        }
      ],
      '/vue/':[
        {
          title: 'Vue',
          collapsable: false,
          sidebarDepth: 2,
          children: [
            ''
          ]
        }
      ],
      '/tracker/':[
        {
          title: 'Feature Tracker',
          collapsable: false,
          sidebarDepth: 2,
          children: [
            ''
          ]
        }
      ]
    }
  },
  markdown: {
    lineNumbers: true
  },
  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}

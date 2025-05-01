import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "Sunny's Blog",
  description: "A VitePress Site",
  base: '/web3-notes',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: 'Solidity', link: '/docs/solidity/func' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Index',
          items: [
            { text: 'Index', link: '/' }
          ]
        }
      ],
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      '/docs/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'One', link: '/docs/guide/one' },
            { text: 'Two', link: '/docs/guide/two' }
          ]
        }
      ],

      // 当用户位于 `config` 目录时，会显示此侧边栏
      '/docs/solidity/': [
        {
          text: 'Solidity 基础',
          items: [
            { text: '简介', link: '/docs/solidity/intro' },
            { text: '数据类型', link: '/docs/solidity/dataType' },
            { text: '函数', link: '/docs/solidity/func' },
            { text: '事件', link: '/docs/solidity/event' },
            { text: '数据存储', link: '/docs/solidity/storage' },
            { text: '错误处理', link: '/docs/solidity/error' },
            { text: '修饰器', link: '/docs/solidity/modifier' },
            { text: '抽象合约与接口', link: '/docs/solidity/abstract' },
            { text: '继承', link: '/docs/solidity/extend' },
            { text: '全局变量/内置属性', link: '/docs/solidity/globalData' },
            { text: 'Gas优化', link: '/docs/solidity/gas' },
          ]
        }, {
          text: 'Solidity 进阶',
          items: [
            { text: '全局变量/内置属性', link: '/docs/solidity/globalData' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

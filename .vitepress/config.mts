import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "Sunny's Blog",
  description: "A VitePress Site",
  base: '/web3-notes',
  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-N91DCTLCTF' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N91DCTLCTF');`
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: 'Solidity', link: '/docs/solidity/func' },
      { text: 'Uniswap V3', link: '/docs/uniswap/overview' }
    ],

    sidebar: {
      // '/': [
      //   {
      //     text: 'Index',
      //     items: [
      //       { text: 'Index', link: '/' }
      //     ]
      //   }
      // ],
      

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
            { text: '合约间的交互', link: '/docs/solidity/Interaction' },
            { text: '合约升级', link: '/docs/solidity/upgrade' },
            { text: 'create 与 create2', link: '/docs/solidity/create' },
            { text: '函数选择器', link: '/docs/solidity/selector' }
          ]
        }
      ],
      '/docs/uniswap/': [
        {
          text: 'Uniswap V3',
          items: [
            { text: '概述', link: '/docs/uniswap/overview' },
            { text: '交易', link: '/docs/uniswap/trade' },
            { text: '流动性', link: '/docs/uniswap/liquidity' },
            { text: '价格计算', link: '/docs/uniswap/price' },
            { text: '费用计算', link: '/docs/uniswap/fee' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

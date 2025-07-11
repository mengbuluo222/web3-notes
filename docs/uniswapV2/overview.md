## Uniswap 简介

Uniswap 协议是一个点对点系统，旨在在以太坊区块链上交换加密货币 （ERC-20 代币） 。该协议由一组持久的、不可升级的智能合约实现；其设计优先考虑抗审查性、安全性、自主托管，并且在无需任何可能选择性限制访问的可信中介机构的情况下运行。

Uniswap 协议目前有四个版本。v1 和 v2 是开源的 ， 并根据 GPL 许可证授权。v3 引入了集中流动性，并且是经过轻微修改的开源版本，可在此处查看。v4 引入了单例池架构和钩子系统，实现了前所未有的协议定制，并使用了双重许可结构。

### 特点
- 去中心化：Uniswap 协议是去中心化的，没有中心化的机构或中介机构来管理交易。
- 智能合约：Uniswap 协议的实现基于智能合约，因此所有交易和数据存储都存储在区块链上。
- 无需许可和不可篡改的设计：Uniswap V2 完全开源，没有许可和版权限制，用户可以自由地使用和修改代码。
- 安全：Uniswap V2 采用了多种安全措施，如代码审计和安全审计，以确保协议的安全性和稳定性。

## Uniswap V2 核心概念

Uniswap V2 是一个去中心化交易所（DEX），基于以太坊区块链构建。它采用自动做市商（AMM）模型，通过流动性池和恒定乘积公式（x * y = k）来实现代币交换。

Uniswap V2 的核心机制包括流动性提供、代币交换和价格预言机。它允许用户无需信任第三方即可进行代币交易，并且提供了高度的去中心化和透明性。

### 1 自动做市商（AMM）

- 传统交易所：依赖订单簿，买卖双方通过挂单和吃单来完成交易。
- AMM：通过流动性池来提供流动性，用户可以直接与流动性池进行交易，而不需要等待对手方。

### 2 流动性池
- 流动性池：由两个代币组成，每个代币的数量和价值是固定的。
- 流动性提供者（LP）：向流动性池中存入两种代币，以支持代币交换。
- 恒定积公式：x * y = k，其中 x 和 y 是池中代币的储备量，k 是一个常数。

### 3 滑点
- 滑点：在 AMM 中，由于价格变化，用户实际获得的代币数量可能与预期不同。
- 滑点范围：通常在 0.5% 到 1% 之间。
滑点是 AMM 中的一个重要概念，它表示价格在交易过程中所允许的最大变化范围。滑点越小，交易价格越稳定，交易效率越高。

### 4 价格预言机
- 价格预言机：Uniswap V2 内置了一个价格预言机，用于提供价格数据。
- TWAP（时间加权平均价格）：提供抗操纵的价格数据。
- 累计价格：每个区块开始时记录市场价格，并将其累加到一个时间加权的累计价格变量中。


graph LR
    A[流动性提供者] -->|存入代币对| B[流动性池]
    B -->|依据恒定乘积公式| C[(x * y = k)]
    D[交易者] -->|用代币A兑换代币B| B

## 交易流程
1. 用户发起交易
用户指定要交换的代币对和数量。
2. 系统计算兑换量
根据恒定乘积公式计算用户可以获得的代币数量。
例如，初始池中有 10 ETH 和 20,000 USDC（k = 200,000），用户存入 1 ETH：
交换后池中有 11 ETH 和约 18,181.82 USDC。
用户获得 20,000 - 18,181.82 = 1,818.18 USDC。
3. 手续费机制
协议收取 0.30% 的手续费，该费用会添加到流动性池中。

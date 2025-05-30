## 实现流程

获取交易报价（即计算输入代币能兑换多少输出代币，或反之）主要通过智能合约的 quoter 功能实现。以下是详细的方法和步骤：

1. 通过合约地址获取交易对的合约实例
2. 通过交易对的合约实例获取交易对的信息
3. 通过交易对的信息获取交易对的价格
4. 返回交易对的价格

### 获取合约实例
```js
const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const quoterContract = new ethers.Contract(
  QUOTER_CONTRACT_ADDRESS,
  Quoter.abi,
  provider()
)
```

### 获取交易对的信息

1. 通过 `computePoolAddress` 计算交易池的部署地址
```js
const currentPoolAddress = computePoolAddress({
  factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
  tokenA: CurrentConfig.tokens.in,
  tokenB: CurrentConfig.tokens.out,
  fee: CurrentConfig.tokens.poolFee,
})
```

2. 获取交易池的合约实例
```js
const poolContract = new ethers.Contract(
  currentPoolAddress,
  IUniswapV3PoolABI.abi,
  getProvider()
)
```

3. 获取交易池的信息
```
const [token0, token1, fee] = await Promise.all([
  poolContract.token0(),
  poolContract.token1(),
  poolContract.fee(),
])
```

### 获取交易对的价格
quoteExactInputSingle 是 Uniswap V3 的 Quoter 合约中的一个方法，用于模拟计算在给定输入金额的情况下，能获得的预期输出代币数量。它通常用于在不实际执行交易的情况下获取报价。callStatic模拟状态更改，但不执行，节省gas。
   
   这个方法接受以下参数：
   
   * tokenIn: 输入代币的地址。
   * tokenOut: 输出代币的地址。
   * fee: 交易池的手续费。
   * amountIn: 输入代币的数量，以最小单位表示。
   * sqrtPriceLimitX96: 价格限制的平方根值，用于限制交易的价格范围。 可选参数；设置为 0 表示不限制，使用整个池子的价格范围进行计算。

   ```
   const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    fromReadableAmount(
      CurrentConfig.tokens.amountIn,
      CurrentConfig.tokens.in.decimals
    ).toString(),
    0
  )
   ```

   这部分逻辑的完整代码已经放在 [github](https://github.com/mengbuluo222/web3-demo/tree/main/pages/priceExample) 上了，请自行查看。
# Create 与 Create2 原理及实现机制

## 介绍
在以太坊智能合约开发中，create 和 create2 是用于创建新合约实例的操作码，它们的主要区别在于创建地址的方式和参数。

## create
create 是以太坊虚拟机（EVM）中用于创建新合约实例的原始操作码。在 Solidity 里，通过 new 关键字来调用 create 操作码。

### 原理
当使用 create 操作码创建合约时，新合约的地址是由创建者的地址和该创建者的交易序列号（nonce）共同决定的。具体的计算公式如下：
- RLP (Recursive Length Prefix) 编码 :
```
new_address = keccak256(rlp([sender_address, nonce]))[12:]
```
- 手动构造 RLP 编码：
```
new_address = keccak256( 0xd6, 0x94, sender_address, <nonce> )[12:]
```
sender_address：创建合约的地址（即调用 CREATE 的合约或外部账户）。
nonce：创建者的交易计数（外部账户）或合约内部的创建计数。


rlp([sender_address, nonce]) 的底层实现就是 0xd6, 0x94, <address>, <nonce>。

所以两种写法本质上是相同的，只是前者更抽象（使用 RLP 库），后者更底层（手动构造）。

合约地址依赖部署者的 nonce，在部署前无法预测地址，部署顺序改变时地址也会变化。

### 适用场景
- 用于常规合约部署。
- 适合不需要预测地址的场景。


## create2
CREATE2 是以太坊君士坦丁堡升级中引入的操作码，允许开发者通过指定的参数来确定性地生成新合约的地址。这使得合约地址可以在部署之前预测。

新合约的地址是通过以下公式计算的：
```
new_address = keccak256(0xff, sender_address, salt, keccak256(init_code))[12:]
```
- 0xff：固定的字节前缀，用于标识这是一个 CREATE2 操作，避免冲突。
- sender_address：创建合约的地址（即调用 CREATE2 的合约或外部账户）。
- salt：一个 32 字节的随机值，用于增加地址的随机性。
- init_code：新合约的初始化代码（通常是合约的字节码）。

特点
- 合约地址只依赖于 sender、salt 和 bytecode，与 nonce 无关。
- 可以在部署之前预测合约地址。
- 如果使用相同的 sender、salt 和 bytecode，即使在不同的区块链上，生成的地址也会相同。

### 适用场景
- 可预测地址：在链下计算合约地址，便于提前与用户或其他合约交互。
- 代理合约模式：通过 salt 部署多个具有相同逻辑但不同地址的合约实例。
- 状态通道：在链下生成合约地址，只有在需要时才部署合约。

- 工厂合约： 工厂合约（Factory Contract）可以使用 CREATE2 部署子合约，使子合约地址可预测
- 合约钱包： 使用 CREATE2 预先计算钱包地址，允许用户在创建钱包前接收资金
- 可升级合约： 将合约地址与特定逻辑绑定，通过 CREATE2 确保逻辑的唯一性和可预测性
- DeFi 合约： 用于创建和管理流动性池等可预测地址的合约
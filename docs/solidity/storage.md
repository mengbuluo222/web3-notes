在 Solidity 里，数据存储方式主要分为存储（`storage`）、内存（`memory`）和调用数据（`calldata`）这三种，它们各自有着不同的特性和使用场景，它们的选择会直接影响存储方式和访问成本。

但是很多小白搞不清楚它们的正确用法以及如何区分，下面我们来详细说明一下：

# 概述
在 Solidity 中，正确的数据存储位置不仅关系到合约的执行效率，还直接影响交易成本（gas）。
- storage: 用于持久存储
- memory: 临时存储
- calldata: 外部函数调用参数

# 存储 storage
###  定义：永久存储在区块链上的变量。
### 适用场景：
  - 状态变量。
  - 显式存储到 storage 的变量。
### 特性：
  - 持久化存储：存储在 `storage` 中的数据会被永久保存到区块链上，这意味着每次交易或合约交互后，数据的修改都会被记录下来。
  - 高成本：由于需要在区块链上永久存储数据，使用 `storage` 会消耗较多的 `gas`，所以在使用时要谨慎考虑。
  - 状态变量：合约中的状态变量默认存储在 `storage` 中。

```
contract StorageExample {
    uint256 public value; // 存储在 storage 中

    function setValue(uint256 _value) public {
        value = _value; // 修改 storage 变量，需支付 Gas
    }
}
```
# 内存 memory
### 定义：临时存储在内存中的变量，仅在函数调用期间存在。
### 适用场景：
- 函数内部的局部变量（默认类型是值类型）
- 用于传递复杂数据类型（如数组和结构体）
### 特性
- 临时性：存储在 memory 中的数据仅在函数执行期间存在，函数执行完毕后，数据就会被销毁
- 低成本：使用 memory 存储数据的 gas 消耗相对较低，因为它不需要永久保存到区块链上
- 函数参数和局部变量：函数的参数和局部变量默认存储在 memory 中

```solidity
contract MemoryExample {
    function add(uint a, uint b) public pure returns (uint) {
        // 函数参数 a 和 b 存储在 memory 中
        // 局部变量 result 也存储在 memory 中
        uint result = a + b;
        return result;
    }
}
```

# 调用数据 calldata
### 定义：专用于 external 函数的输入参数，存储在调用数据中。
### 适用场景
- 接收外部调用的函数参数。

### 特性
- 只读性：calldata 是一种特殊的存储位置，用于存储函数调用的参数，它是只读的，意味着在函数内部不能修改 calldata 中的数据。
- 临时性：与 memory 类型，calldata 中的数据仅在函数调用期间存在
- 高效性：使用 calldata 可以避免数据的复制，从而提高性能。可以用来优化 gas 成本

```
function updateName(string calldata _name) external pure returns (string memory) {
    return _name; // 只能读取 _name，不能修改
}
```

# storage、memory 与 calldata 的对比
为了方便大家更直观清晰的区分它们之间的区别，这里整理了一个表格：

| 存储位置 | 持久性 | 适用范围 | 修改成本  |
| --- | --- | --- | --- | 
|  storage | 持久存储 |状态变量、全局变量  |  高 |  
|  memory | 临时存储 |局部变量、传递数据  |  低 |  
|  calldata |  只读存储|  外部函数饿输入参数  | 无 |

# 常见问题及优化
### 状态变量存储成本高
  - 原因：storage 是区块链的永久存储，写操作非常昂贵。
  - 优化建议：
    1. 尽量减少状态变量的写操作。
    2.  使用事件（Event）替代直接写入变量以记录信息。
### 动态数组传递的 gas 消耗
  - 原因：复杂数据类型（如数组和结构体）传递会导致内存拷贝。
  - 优化建议：如果数据是只读的，使用 calldata。
### 使用全局变量的成本

  - 问题：频繁访问 block 或 msg 的全局变量会增加 Gas 消耗。
  - 优化建议：在局部变量中缓存全局变量，减少重复读取。

# 易混概念 stack
像我刚刚学习的时候，就很分不清 storage、memory、calldata 与 stack 有什么区别，到底 stack 应该怎么用呢？

在 Solidity 里，Stack（栈）是 EVM（以太坊虚拟机）用来管理函数调用和临时数据的一种后进先出（LIFO）**数据结构**。它是一种重要的数据存储机制，主要用于临时存储和计算中间值。

### 特性
* **LIFO（后进先出）**：最后压入的数据最先弹出。
    * 所有计算操作（如假发、乘法）都从栈顶进行插入和弹出
* **256位（32字节）宽度**：每个栈元素固定为 32 字节（兼容 EVM 的 256 位字长）。
* **1024 深度限制**：栈最多容纳 1024 个元素，超出会触发 **栈溢出**（`Stack Too Deep` 错误）。
* **高效**：栈操作非常快速，因为只需在栈顶进行插入和弹出
* **临时性**： 栈中的数据仅在当前执行上下文中有效，执行结束后自动销毁

### 用途
- 临时存储中间值
```
uint a = 5;
uint b = 10;
uint c = a + b; // a 和 b 被压入栈，加法操作后结果 c 压入栈
```
- 函数调用参数与返回值
```
function add(uint a, uint b) public pure returns (uint) {
    return a + b; // 参数和结果均在栈中处理
}
```
- 控制流
    条件判断和循环依赖栈顶值。
```
function check(uint256 value) public pure returns (bool) {
    if (value > 10) { // 编译为 PUSH value, PUSH 10, GT, JUMPI
        return true;
    }
    return false;
}
```

### 栈的典型问题与解决方案
1. **Stack Too Deep 错误**

当函数局部变量或表达式复杂度超过 **16 个栈槽** 时，编译器会报错。
```
function tooManyVariables() public pure {
    uint256 a; uint256 b; uint256 c; // ... 超过 16 个变量
}
```

修复方案：

- 使用结构体或数组：将变量打包为结构体减少栈调用
- 拆分函数：将复杂拆分为多个子函数

**2. 优化 gas 消耗**

栈操作直接影响 gas 成本：
- 减少栈深度：合并重复计算
 ```
// 优化前：多次压栈
uint256 x = a + b;
uint256 y = a + b; 

// 优化后：复用计算结果
uint256 sum = a + b;
uint256 x = sum;
uint256 y = sum;
 ```
 - 使用内联汇编：手动控制栈操作（需谨慎）
 ```
function optimizedAdd(uint256 a, uint256 b) public pure returns (uint256) {
    assembly {
        let result := add(a, b)
        mstore(0x80, result) // 存储到内存
    }
}
```
### 栈与内存、存储的对比
| 特性         | Stack   | Memory      | Storage  |
| ---------- | ------- | ----------- | -------- |
| **作用域**    | 当前执行上下文  | 函数执行期间      | 合约生命周期     |
| **Gas 成本** | 最低（纯计算） | 中等（临时扩展）    | 最高（链上存储） |
| **访问速度**   | 最快      | 快           | 慢        |
| **容量限制**   | 1024 元素 | 动态扩展（需 Gas） | 无硬性限制    |
|**持久性**|非持久化|非持久化|持久化|
| **适用场景**   | 操作数和中间结果 | 临时复杂数据存储 | 持久化变量    |
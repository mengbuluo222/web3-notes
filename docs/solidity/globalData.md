
# 地址类型
与地址类型紧密相关，用于地址的检查、转账等操作。
| 方法 / 属性                           | 说明                                                             |
| --------------------------------- | -------------------------------------------------------------- |
| `balance`                         | 地址的以太币余额，如 `address.balance`                                   |
| `transfer(uint256 amount)`        | 向指定地址转账，如 `address.transfer(amount)`，转账失败会抛出异常                 |
| `send(uint256 amount)`            | 向指定地址转账，返回布尔值表示是否成功，如 `address.send(amount)`                   |
| `call(bytes memory data)`         | 低级别调用，可用于调用其他合约的函数或发送以太币，如 `address.call{value: amount}(data)` |
| `delegatecall(bytes memory data)` | 委托调用，调用其他合约的代码但使用当前合约的存储，如 `address.delegatecall(data)`        |
| `staticcall(bytes memory data)`   | 静态调用，不允许修改状态，如 `address.staticcall(data)`                      |

- address 与 address payable
    在 Solidity 中，address 类型的变量不能接收或发送 Ether。如果需要进行这些操作，需要使用 address payable 类型。
    ```
    address payable public myPayableAddress;
    ```
# 全局变量
全局变量在合约的任何位置都能使用，以下是常见的全局变量：

| 变量名     | 说明                                                             |
| ------- | -------------------------------------------------------------- |
| `block` | 包含当前块信息，如 `block.timestamp`（当前块的时间戳）、`block.number`（当前块号）等     |
| `msg`   | 包含当前消息调用的信息，如 `msg.sender`（消息发送者的地址）、`msg.value`（随消息发送的以太币数量）等 |
| `tx`    | 包含当前交易的信息，如 `tx.gasprice`（当前交易的 gas 价格）                        |

 # 合约相关
 在合约内部使用，用于合约的创建、销毁和信息获取等操作。

| 方法 / 属性                                   | 说明                                   |
| ----------------------------------------- | ------------------------------------ |
| `this`                                    | 表示当前合约实例，可用于获取合约地址，如 `address(this)` |
| `selfdestruct(address payable recipient)` | 销毁当前合约，并将合约的余额发送到指定地址                |

# 数学和加密
常见的数学运算和加密操作。

| 方法 / 属性                                   | 说明                    |
| ----------------------------------------- | --------------------- |
| `addmod(uint256 x, uint256 y, uint256 k)` | 计算 `(x + y) % k`，防止溢出 |
| `mulmod(uint256 x, uint256 y, uint256 k)` | 计算 `(x * y) % k`，防止溢出 |
| `keccak256(bytes memory data)`            | 计算 Keccak-256 哈希值     |
| `sha256(bytes memory data)`               | 计算 SHA-256 哈希值        |
| `ripemd160(bytes memory data)`            | 计算 RIPEMD-160 哈希值     |

# 异常处理
用于处理合约执行过程中的异常情况。

| 方法 / 属性                                          | 说明                             |
| ------------------------------------------------ | ------------------------------ |
| `require(bool condition, string memory message)` | 检查条件是否满足，不满足则抛出异常并显示消息         |
| `assert(bool condition)`                         | 检查条件是否满足，不满足则抛出严重错误，通常用于内部错误检查 |
| `revert(string memory message)`                  | 立即终止执行并回滚状态，可提供错误消息            |
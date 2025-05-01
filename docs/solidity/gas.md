在以太坊等区块链网络中，Gas 是执行智能合约操作所需支付的费用，Gas 优化能够降低交易成本并提升合约执行效率。下面我来5个方面总结常用的 Solidity 智能合约中 Gas 优化的方法：

# 变量和数据类型方面
- **选用合适的数据类型**
    优先采用占用空间小的数据类型。例如，数值范围较小就使用 uint8 而不是 uint256
- **状态变量的打包**
    solidity 里每个存储槽（slot）大小为32字节，把多个小的状态变量组合到一个存储槽可节省 gas。
   ```solidity
    // 不推荐
    uint8 a;
    uint8 b;
    // 推荐
    struct Packed {
        uint8 a;
        uint8 b;
    }
    Packed packed;
 # 函数和控制结构方面
 - **避免重复计算**
 把重复计算的结果存储在局部变量中，防止重复执行相同的计算。
     ```solidity
    // 不推荐
    function calculateSum() public view returns (uint256) {
        return (1 + 2 + 3) + (1 + 2 + 3);
    }
    // 推荐
    function calculateSum() public view returns (uint256) {
        uint256 temp = 1 + 2 + 3;
        return temp + temp;
    }
    ```
- 减少循环次数 | 减少计算
在循环中尽量减少不必要的操作，避免无限循环。
循环中还可以把 `array.length` 用一个变量代替，减少计算量；同样如果循环体中多次用到 `array[i]` 也可用变量代替
```solidity
// 不推荐
for (uint256 i = 0; i < array.length; i++) {
    if (array[i] == 0) {
        continue;
    }
    // 处理逻辑
}
// 推荐
let len = array.length;
for (uint256 i = 0; i < len; i++) {
    let item = array[i];
    if (item != 0) {
        // 处理逻辑
    }
}
```
- 短路求值
    使用逻辑运算符 && 和 || 时，利用短路求值特性减少不必要的计算
    ```solidity
    if (condition1 && condition2) {
        // 执行代码
    }
    ```
    若 `condition1` 为 `false`，则不会再计算 `condition2`。
    
    # 存储和内存使用方面
    - 减少存储读写
        存储操作（`SSTORE` 和 `SLOAD`）消耗的 Gas 较多，尽量减少对状态变量的读写操作。可先把状态变量的值读取到局部变量，在局部变量上进行操作，最后再写回状态变量。
        ```solidity
        // 不推荐
        function updateValue() public {
            stateVariable = stateVariable + 1;
        }
        // 推荐
        function updateValue() public {
            uint256 temp = stateVariable;
            temp = temp + 1;
            stateVariable = temp;
        }
        ```
    - 内存的合理使用
       内存操作（`MSTORE` 和 `MLOAD`）消耗的 Gas 相对较少，但也要避免不必要的内存分配和复制。

# 合约设计和继承方面
- 合约的拆分
    把大型合约拆分成多个小合约，通过合约间的调用实现功能，这样可减少单个合约的复杂度和 Gas 消耗。
- 避免深度继承
继承层次过深会增加合约的复杂度和 Gas 消耗，尽量保持继承层次简洁。

# 事件和日志方面
- 使用事件记录数据
    事件用于记录合约状态的变化，存储在日志中，不消耗存储 Gas。需要记录数据时，优先使用事件。
    ```solidity
    contract EventExample {
        event ValueUpdated(uint256 newValue);

        function updateValue(uint256 _newValue) public {
            // 触发事件
            emit ValueUpdated(_newValue);
        }
    }
    ```

# 外部调用和库方面
- 减少外部调用
    外部调用（如 `call`、`delegatecall`）消耗的 Gas 较多，尽量减少不必要的外部调用。
- 使用库
    把常用的功能封装到库中，通过库函数调用可减少代码的重复，降低 Gas 消耗。
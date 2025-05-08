# 合约交互
在 Solidity 中，call、delegatecall、staticcall 和 multicall 是用于合约间交互的四种重要机制。

- call 和 delegatecall 是用于执行外部合约调用的低级函数
- staticcall 是一种只读调用，用于调用另一个合约的只读函数
- Multicall 是一种实现，可以一次性执行多个合约调用，减少交易成本和提高效率。

## call
call 是一种低级函数调用方式，用于调用另一个合约的函数。它是非常灵活的，但也更容易出错。

### 特点
- 可以调用目标合约的任何函数，包括只读函数
- 允许发送以太币（msg.value）
- 返回布尔值，表示是否调用成功

### 用法
```solidity
(bool success, bytes memory data) = targetContract.call(abi.encodeWithSignature("functionName()"));
```

**注意：**
- 如果目标合约不存在或函数签名错误，call 不会抛出异常，而是返回 false。
- 使用 call 时需要特别小心，避免重入攻击。

## delegatecall
delegatecall 是一种特殊的 call 调用方式，用于调用目标合约的函数，使用当前合约的上下文（包括存储和余额），但不创建新的合约实例。

### 特点
- 目标合约的代码在调用合约的上下文中执行。
- 调用合约的存储、余额（msg.value）和 msg.sender 不会改变。
- 常用于代理合约模式（Proxy Pattern）。
- 支持合约升级。

### 用法
```solidity
(bool success, bytes memory data) = targetContract.delegatecall(abi.encodeWithSignature("functionName()"));
```

## staticcall
`staticcall` 是一种只读调用方式，用于调用另一个合约的函数，与 call 类似，但不会修改目标合约的状态。
用于防止调用中对状态进行修改，例如读取数据。

### 特点
- 只能调用目标合约的只读函数,view 或  pure 函数
- 不允许发送以太币（msg.value）
- 返回布尔值，表示调用是否成功。

### 用法
```solidity
(bool success, bytes memory data) = targetContract.staticcall(abi.encodeWithSignature("functionName()"));
```

## Multicall
Multicall 是一种实现，可以一次性执行多个合约调用，减少交易成本和提高效率。
它通常用于聚合多个合约的只读函数调用，返回多个结果。

### 特点
- 可以一次性执行多个合约调用
- 减少交易成本

### 用法
- TargetContract
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract TargetContract {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
```
- TargetContractOne
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract TargetContractOne {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
```
- MultiCall and MultiCaller
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { console} from "forge-std/console.sol";


contract MultiCall {
    struct Call {
        address targetAddress;
        bytes  callData;
    }

    constructor() {
    }

    function multicall(Call[] memory calls) public {
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, ) = calls[i].targetAddress.call(calls[i].callData);
            require(success, "call item failed");
        }
    }
}


contract MultiCaller {
    MultiCall public multiCall;

    constructor(address _multiCall){
        multiCall = MultiCall(_multiCall);
    }

    function setNumbers(address target, uint256 number, address targetOne, uint256 numberOne) public {
        console.log("target==", target);
        console.log("data==", number);
        console.log("targetOne==", targetOne);
        console.log("dataOne==", numberOne);

        MultiCall.Call[] memory calls = new MultiCall.Call[](2);

        calls[0] = MultiCall.Call({
            targetAddress: target,
            callData: abi.encodeWithSignature("setNumber(uint256)", number)
        });

        calls[1] = MultiCall.Call({
            targetAddress: targetOne,
            callData: abi.encodeWithSignature("setNumber(uint256)", numberOne)
        });
        multiCall.multicall(calls);
    }
}
```
- MultiCallerTest
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import { TargetContract } from "../src/TargetContract.sol";
import { TargetContractOne } from "../src/TargetContractOne.sol";

import {MultiCaller, MultiCall } from "../src/MultiCaller.sol";


contract MultiCallerTest is Test {
    TargetContract public targetContract;
    TargetContractOne public targetContractOne;
    MultiCall public multiCall;
    MultiCaller public multiCaller;

    function setUp() public {
        multiCall = new MultiCall();
        targetContract = new TargetContract();
        targetContractOne = new TargetContractOne();
        multiCaller = new MultiCaller(address(multiCall));
    }

    function test_SetNumbers() public {
        multiCaller.setNumbers(address(targetContract), 50, address(targetContractOne), 60);
        console.log("=============================");
        console.log("targetContract.number()=", targetContract.number());
        console.log("targetContractOne.number()=", targetContractOne.number());
        console.log("==============================");
    }
}
```

**注意：**
- 如果某个调用失败，可能会导致整个交易回滚（取决于实现）。
- 需要小心处理重入攻击和 gas 限制问题。

|调用方式|是否修改状态|是否使用调用合约存储|是否允许发送以太币|
|-|-|-|-|
|call|是|否|是|
|delegatecall|是|是|否|
|staticcall|否|否|否|
|multicall|取决于实现|取决于实现|取决于实现|
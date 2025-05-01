# 事件和日志

- 在 Solidity 合约中，事件（Event）是一种特殊的机制，事件用于记录合约的状态变化，方便外部应用监听和处理。
- 在函数中可以触发事件

事件允许合约与区块链上的外部系统进行交互，典型的应用包括记录状态变化、提供数据查询以及与前端应用程序进行实时通信等。
```
contract EventExample {
    event Transfer(address indexed from, address indexed to, uint value);

    function transfer(address to, uint value) public {
        // 执行转账逻辑
        emit Transfer(msg.sender, to, value);
    }
}
```
## 1 定义事件
在 Solidity 中，事件是通过 event 关键字定义的。事件定义通常放在合约的顶层，其语法如下：
```
event EventName(address indexed _addressParam, uint _uintParam, string _stringParam);
```
- EventName 是事件的名称。
- address indexed _addressParam、uint _uintParam、string _stringParam 是事件的参数列表。在事件中可以定义多个参数，可以是任何 Solidity 支持的数据类型，包括基本类型、结构体、数组和映射等。
- indexed 关键字用于指定该参数为索引参数，允许外部应用程序通过该参数进行快速检索。

## 2 触发事件
在 Solidity 合约中，使用 emit 关键字触发事件。通常在合约内部的函数中触发事件，以记录合约状态的重要变化或者向外部应用程序发送通知。
```
contract EventExample {
    event NewUserRegistered(address indexed user, uint timestamp);

    function registerUser() public {
        // 假设有一些逻辑用来注册新用户
        address newUser = msg.sender;
        uint timestamp = block.timestamp;

        // 触发事件
        emit NewUserRegistered(newUser, timestamp);
    }
}
```

## 3 事件的作用
- 日志记录：事件可以记录合约的重要状态变化，如代币转账、用户注册等，方便后续的审计和分析。
- 外部监听：外部应用（如 DApp 前端、区块链浏览器等）可以监听事件，实时获取合约的状态变化并做出相应的处理。
- 轻客户端优化：轻客户端可以通过监听事件来同步合约的状态，而无需下载整个区块链数据。

## 4 事件的存储和查询
- 存储：事件日志会被永久存储在区块链上，但不会影响合约的状态变量。事件日志包含事件的名称、参数值以及一些元数据。
- 查询：可以使用以太坊节点的 API（如 Web3.js、Ethers.js 等）来查询事件日志。查询时可以根据事件的名称、索引参数等进行筛选。

## 5 事件与合约继承
事件可以在合约继承中使用，子类合约可以触发父类合约中定义的事件。示例如下：
```
pragma solidity ^0.8.0;

contract Parent {
    event ParentEvent(uint256 value);

    function triggerParentEvent(uint256 _value) public {
        emit ParentEvent(_value);
    }
}

contract Child is Parent {
    function triggerEventFromChild(uint256 _value) public {
        // 子类合约触发父类合约的事件
        emit ParentEvent(_value);
    }
}
```

## 6 如何查看事件的4种调用情况
1. 使用以太坊区块链浏览器
- 原理：以太坊区块链浏览器（如 Etherscan）会索引并展示以太坊网络上的交易和事件数据。只要合约在公共以太坊网络（如主网、Ropsten 测试网等）上部署，就可以借助区块链浏览器查看合约的事件调用情况。
- 操作步骤
打开区块链浏览器（如 Etherscan）。
在搜索框输入合约地址，然后进入合约页面。
在合约页面中找到 “Events”（事件）选项卡，这里会列出该合约触发的所有事件，包含事件的名称、参数以及触发的交易哈希等信息。
2. 使用 Web3.js 或 Ethers.js 监听事件
原理：利用 Web3.js 或者 Ethers.js 等库与以太坊节点交互，监听合约事件。这样可以实时捕获并处理合约触发的事件。
```
// 合约地址
const contractAddress = '0xYourContractAddress';

// 连接到以太坊节点
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/your-infura-project-id');

// 创建合约实例
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// 监听事件
contract.on('Transfer', (from, to, value, event) => {
    console.log(`Transfer event: From ${from} to ${to}, Value: ${value.toString()}`);
    console.log('Event data:', event);
});
```
3. 在测试框架中捕获事件
在使用 Truffle 或者 Hardhat 等测试框架对合约进行测试时，可以捕获并验证事件的触发情况。
示例代码（使用 Hardhat 和 Mocha）
```
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MyContract', function () {
    let myContract;

    beforeEach(async function () {
        const MyContract = await ethers.getContractFactory('MyContract');
        myContract = await MyContract.deploy();
        await myContract.deployed();
    });

    it('Should emit an event', async function () {
        const tx = await myContract.someFunction();
        const receipt = await tx.wait();

        // 查找特定事件
        const event = receipt.events.find(event => event.event === 'MyEvent');
        expect(event).to.exist;
        expect(event.args.someParameter).to.equal('expectedValue');
    });
});
```
4. 使用调试工具
像 Remix 这样的在线开发环境，具备调试功能，在调试合约时可以查看事件的触发情况。


## 7 注意
- Gas 成本：触发事件会消耗 gas，特别是如果事件有多个索引参数或者频繁触发。应当注意控制事件触发的频率和消耗，以避免不必要的 gas 费用。
- 事件日志：事件触发后，相关的数据将会被记录在区块链上的事件日志中。外部应用程序可以通过扫描事件日志来获取历史记录或者进行数据分析。
- 隐私性：事件的参数可以是公开的（例如用户地址），但也可以通过合适的权限控制保护隐私。

建议：有修改合约状态的地方都加上事件，方便前端监听。
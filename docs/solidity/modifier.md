函数修饰器并不是一个新鲜的概念，但是它的用法在 solidity 中与其他语言中稍有不同，接下来我们详细介绍一下 solidity 中的函数修饰器。

函数修饰器是 Solidity 的重要组成部分，是一种特殊的语法结构，在以声明方式改变函数行为方面被广泛使用。

它能够复用代码逻辑，增强代码的可维护性与安全性；它可以在函数执行前后添加额外的逻辑，像是权限检查、状态验证等。

# 基本语法
函数修饰器使用 `modifier` 关键字来定义，语法格式如下：
```solidity
modifier 修饰器名称(参数列表) {
    // 修饰器逻辑
    _; // 表示插入被修饰函数的代码
    // 修饰器后续逻辑
}
```
`_;` 是一个特殊的占位符，代表被修饰函数的代码将在此处插入。

# 使用方法示例
### 1. 简单示例
用于检查调用者是否为合约的所有者，示例如下：

```solidity
contract OwnerModifierExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // 定义一个修饰器，用于检查调用者是否为合约所有者
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // 使用修饰器的函数
    function doSomething() public onlyOwner {
        // 只有合约所有者可以执行此函数
    }
}
```
### 2. 带参数的修饰器
函数修饰器也可以接受参数。示例如下：

```solidity
contract ParameterModifierExample {
    // 定义一个带参数的修饰器，用于检查传入的数值是否大于指定值
    modifier greaterThan(uint _value) {
        require(msg.value > _value, "Value must be greater than the specified amount");
        _;
    }

    // 使用带参数修饰器的函数
    function sendEth() public payable greaterThan(1 ether) {
        // 只有发送的以太币数量大于 1 ether 时，才能执行此函数
    }
}
```
### 3. 多个修饰器的使用
一个函数可以使用多个修饰器，修饰器会按照声明的顺序依次执行。示例如下：

```solidity
contract MultipleModifiersExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // 定义一个修饰器，用于检查调用者是否为合约所有者
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // 定义一个修饰器，用于检查传入的数值是否大于 0
    modifier nonZeroValue() {
        require(msg.value > 0, "Value must be greater than 0");
        _;
    }

    // 使用多个修饰器的函数
    function doSomethingWithEth() public payable onlyOwner nonZeroValue {
        // 只有合约所有者且发送的以太币数量大于 0 时，才能执行此函数
    }
}
```
### 4. 修饰器的嵌套使用
修饰器也可以嵌套使用，即在一个修饰器内部调用另一个修饰器。示例如下：

```solidity
contract NestedModifiersExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // 定义一个修饰器，用于检查调用者是否为合约所有者
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // 定义一个修饰器，用于检查传入的数值是否大于 0
    modifier nonZeroValue() {
        require(msg.value > 0, "Value must be greater than 0");
        _;
    }

    // 定义一个嵌套修饰器，同时使用 onlyOwner 和 nonZeroValue
    modifier ownerAndNonZero() {
        onlyOwner;
        nonZeroValue;
        _;
    }

    // 使用嵌套修饰器的函数
    function doSomethingNested() public payable ownerAndNonZero {
        // 只有合约所有者且发送的以太币数量大于 0 时，才能执行此函数
    }
}
```
### 5. 修饰器放在代码前面的例子

在 Solidity 中，函数修饰器里的占位符 `_;` 通常是放在检查逻辑之后，但也可以将其放在代码前面，以此实现在被修饰函数执行之后再执行某些逻辑。示例如下：

```solidity
contract ModifierWithPlaceholderFirst {
    uint public totalCalls;

    // 定义一个修饰器，在被修饰函数执行后增加调用次数
    modifier incrementCallsAfter() {
        _; // 先执行被修饰函数的代码
        totalCalls++; // 被修饰函数执行完后，增加调用次数
    }

    // 使用修饰器的函数
    function doSomething() public incrementCallsAfter {
        // 这里可以添加函数的具体逻辑
    }
}
```
通过以上示例，我们可以了解 Solidity 函数修饰器的基本用法、带参数修饰器的使用、多个修饰器的使用以及修饰器的嵌套使用。函数修饰器可以帮助你编写更加模块化、可维护和安全的智能合约代码。
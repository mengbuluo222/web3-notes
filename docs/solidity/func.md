在 Solidity 里，函数是合约的关键构成部分，用于执行特定任务或操作的代码块，可以包含逻辑、访问状态变量、进行计算，并且可以接受参数和返回值。

但是solidity 的函数与其他语言不太一样，经常会有同学搞混，这里开一篇文章完整介绍一下 solidity 函数的用法。

# 1. 函数定义与声明
```
function functionName(parameterType1 parameterName1, parameterType2 parameterName2, ...) visibility modifiers returns (returnType1, returnType2, ...) {
    // 函数体
}
```
- function 关键字声明函数
- functionName：函数的名称。
- parameterType 和 parameterName：函数的参数，可包含多个参数，参数之间用逗号分隔。
- visibility：函数的可见性，如 public、private、internal、external。
- modifiers：可选的修饰符，如 pure、view、payable 等。
- returns：指定函数的返回值类型，可返回多个值。

# 2. 函数的修饰符
## 2.1 函数的可见性
函数可见性修饰符可以用来修饰状态变量和函数，决定了函数的访问权限，具体如下：
- public： 函数可以被合约内外的任何代码调用。默认为 public。
- private：函数只能在定义它的合约内部被调用，在派生合约里也是无法访问的。
- internal：函数只能在定义它的合约及其派生合约中被调用。
- external：函数只能从合约外部调用，不能在合约内部直接调用，但可以使用 this.functionName() 的方式调用。

## 2.2 函数状态的可见性
函数状态可变性修饰符用于描述函数是否会修改合约的状态变量，主要用于定义函数的行为和特性。具体有以下几种：
- pure：函数既不读取也不修改合约的状态变量(即完全不访问状态变量)，通常用于执行纯数学计算等操作。
 	
 	- 不允许访问`this`和`msg`对象。
 	- 可以在编译时被内联优化。
 	- 不能发送以太币。
	```
	function add(uint a, uint b) public pure returns (uint) {
	    return a + b;
	}
	```
- view：函数只读取合约的状态变量，但不修改它们。
	
	- 可以调用其他 `view` 或 `pure`函数
	- 不允许修改状态变量
	- 不允许发送以太币
	 	
	```
	contract MyContract {
	    uint public myVariable = 10;
	
	    function getMyVariable() public view returns (uint) {
	        return myVariable;
	    }
	}
	```
- payable：函数可以接收 Ether，当调用该函数时，可以附带一定数量的 Ether。
	
	- 允许接收以太币
	- 可以调用其他`payable`函数
	 
	```
	function calculate(uint a, uint b) public pure returns (uint sum, uint product) {
	    sum = a + b;
	    product = a * b;
	    return (sum, product);
	}
	```
- virtaul：函数可以被派生合约重写覆盖
		
	- 在父合约中声明函数为 virtual，表示该函数可以在派生合约中被重写。
  - 派生合约中可以使用 override 关键字重写 virtual 函数。
  - virtual 函数可以有默认实现，但也可以是纯虚函数（即没有实现，只是声明）。 
  ```
  contract Base {
	    // virtual 函数示例
	    function getValue() public virtual returns (uint) {
	        return 10;
	    }
	}
	
	contract Derived is Base {
	    // override 覆盖基类函数
	    function getValue() public virtual override returns (uint) {
	        return 20;
	    }
	}
  ```
## 2.3 注意事项
- 默认可见性：如果不显示指定可见性修饰符，则默认为 public。这意味着如果你只想让函数或状态变量在合约内部使用，应该显式使用 internal 或 private。
- Gas 成本：不同的可见性修饰符可能会影响函数调用的 gas 成本，特别是 external 函数的 gas 成本较高，因为它们需要进行消息调用。
- 安全性：合理使用可见性修饰符可以提高合约的安全性和可读性，避免不必要的访问和操作。
	
# 3. 参数和返回值
- 参数：函数可以有零个或多个参数，参数类型可以是 Solidity 支持的任何类型，如 uint、address、bool 等。
- 返回值：函数可以返回零个或多个值，返回值类型也可以是 Solidity 支持的任何类型。**当返回多个值时，需要用 `()` 包裹起来**。
	```
	function calculate(uint a, uint b) public pure returns (uint sum, uint product) {
	    sum = a + b;
	    product = a * b;
	    return (sum, product);
	}
	```
# 4. 函数重写和重载
## 4.1 函数重写（Override）
函数重写是指在派生合约（子合约）中重新定义父合约中已经存在的虚函数（virtual function），通过在派生合约中使用 override 关键字来标识要重写的函数。
```
contract Base {
    function getValue() public virtual returns (uint) {
        return 10;
    }
}

contract Derived is Base {
    function getValue() public virtual override returns (uint) {
        return 20;
    }
}
```
函数重写允许派生合约在不改变原有合约结构的情况下，根据具体的需求重定义函数的行为。

## 4.2 函数重载（Overload）
函数重载是指在同一个合约中定义多个具有相同函数名但不同参数列表的函数；根据参数的类型和数量来区分不同的函数定义。
```
contract OverloadExample {
    function foo(uint _value) public pure returns (uint) {
        return _value;
    }

    function foo(uint _value, uint _value2) public pure returns (uint) {
        return _value + _value2;
    }

    function foo(string memory _text) public pure returns (string memory) {
        return _text;
    }
}
```
函数重载允许在同一个合约中根据参数的不同，提供不同的函数实现。Solidity 编译器会根据函数的参数列表生成唯一的函数签名，以便区分不同的函数定义。

## 4.3 函数重写和函数重载的区别
- 函数重写（Override）：发生在派生合约中，重新定义父合约中已存在的虚函数，使用 override 关键字标识。
- 函数重载（Overload）：发生在同一个合约中，定义具有相同函数名但不同参数列表的多个函数，根据参数的类型和数量来区分。

**注意：**
- 在使用函数重载时，应当注意参数列表的唯一性，避免出现二义性，确保函数能够正确地被调用和使用。
- 函数重写通常用于实现继承中的多态特性，而函数重载则用于提供不同的功能选项或操作符号重载等场景。

# 5. 构造函数
构造函数是一种特殊的函数，在合约创建时自动执行，用于初始化合约的状态变量。在 Solidity 0.4.22 及以后的版本中，构造函数使用 constructor 关键字定义。
```
contract ConstructorExample {
    uint public myValue;

    constructor(uint initialValue) {
        myValue = initialValue;
    }
}
```
## 5.1 构造函数的特点
- 自动执行：在合约部署到区块链时，构造函数会自动运行，无需手动调用。
- 仅执行一次：构造函数在合约的整个生命周期内仅执行一次，即合约创建时。
- 可带参数：构造函数可以有零个或多个参数，这些参数可用于在合约创建时进行初始化设置。

## 5.2  构造函数的可见性
构造函数可以有 public 或 internal 两种可见性：
- public：默认的可见性，意味着任何合约都可以创建该合约的实例。
- internal：表示构造函数只能在当前合约及其派生合约中使用，常用于抽象合约或库合约。

## 5.3 构造函数与继承
在合约继承中，派生合约的构造函数可以调用父合约的构造函数。调用方式有两种：

- 直接调用

	```
	contract Parent {
	    uint public parentValue;
	
	    constructor(uint _value) {
	        parentValue = _value;
	    }
	}
	
	contract Child is Parent {
	    constructor(uint _parentValue, uint _childValue) Parent(_parentValue) {
	        // 子合约的初始化操作
	    }
	}
	```
- 使用参数传递
 	在派生合约的构造函数定义中指定父合约构造函数所需的参数。
	```
	contract Parent {
	    uint public parentValue;
	
	    constructor(uint _value) {
	        parentValue = _value;
	    }
	}
	
	contract Child is Parent(10) {
	    // 子合约的构造函数
	    constructor() {
	        // 子合约的初始化操作
	    }
	}
	```
	## 5.4 注意
	构造函数的执行需要消耗一定的 gas，因为它涉及到状态变量的初始化和存储操作。在设计构造函数时，要尽量减少不必要的操作，以降低 gas 消耗。

# 6. 回退函数
回退函数是一种特殊的函数，没有名称、参数和返回值，当调用合约中不存在的函数或直接向合约发送 Ether 时会触发回退函数。

在 Solidity 0.6.0 版本之前，只有一个单一的回退函数（通过空函数名定义），它既要处理接收以太币的情况，也要处理调用合约中不存在函数的情况。而在 0.6.0 及之后的版本，为了让逻辑更加清晰，对这两种情况进行了拆分，引入了 `receive` 函数专门处理接收以太币且无数据的情况，把调用不存在函数以及接收附带数据的以太币的情况交给 `fallback` 函数处理。


## 触发条件
* **`receive()` 函数**：专门处理接收以太币且交易数据为空的情况，比如记录接收的以太币信息、更新用户余额等。当外部账户（EOA）或合约账户向当前合约发送以太币（Ether），并且交易数据字段为空（即没有附带任何额外数据）时，`receive()` 函数会被触发。
```solidity
contract ReceiveExample {
    event EtherReceived(address indexed sender, uint256 amount);

    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }
}
```
* **`fallback()` 函数**：处理两种情况，一是调用合约中不存在的函数；二是向合约发送以太币且附带了数据。可用于实现代理合约、合约升级等复杂功能。


回退函数必须标记为 external，并且可以是 payable 或非 payable。
```
contract FallbackExample {
    fallback() external payable {
        // 处理接收到的 Ether
    }
    
    receive() external payable {
        // 函数体，可包含处理逻辑
    }
}
```

## 调用优先级
当向合约发送以太币时，合约会优先检查是否存在 `receive()` 函数。如果存在且交易数据为空，就会调用 `receive()` 函数；如果不存在 `receive()` 函数，或者交易数据不为空，则会尝试调用 `fallback()` 函数（前提是 `fallback()` 函数存在且为 `payable`）。


## 注意
- Gas 限制：回退函数的执行有 gas 限制，因为它通常在一些特殊情况下被触发，为避免阻塞区块链，以太坊对其消耗的 gas 有严格规定。
- 复杂性限制：由于 gas 限制，回退函数里应避免复杂的逻辑和大量的状态修改操作，不然可能会因 gas 不足而执行失败。
- 安全性：在回退函数里接收 Ether 时，要特别注意重入攻击等安全问题，可使用 OpenZeppelin
 的 ReentrancyGuard 等机制来防范。


# 7. 函数修饰器

函数修饰器用于在函数执行前后添加额外的逻辑，如权限检查、条件判断等。修饰器使用 modifier 关键字定义。
```
contract ModifierExample {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function doSomething() public onlyOwner {
        // 只有合约所有者可以调用该函数
    }
}
```
之前写过一篇文章详细介绍过函数的修饰器，如果想了解请查看[【# solidity必知】函数修饰器用法汇总
](https://learnblockchain.cn/article/15108)



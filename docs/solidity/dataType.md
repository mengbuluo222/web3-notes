solidity 的数据类型分为：值类型和引用类型，下面详细的介绍分别有哪些及使用方法。

# 值类型
值类型的变量在赋值或作为参数传递时，会复制整个值。这个分别与 javascript 的概念是相同的。
值类型包括：布尔类型、整数型、地址类型、定长字节数组、枚举、函数。

## 1.布尔类型
- 只有两个值：true 和 false。
- 通常用于控制流程、状态检查和条件判断。
- 支持基本的布尔运算，如逻辑与（&&）、逻辑或（||）和逻辑非，遵循短路规则
```
bool a = true;
bool b = false;
bool resultAnd = a && b; // false
bool resultOr = a || b;  // true
bool resultNot = !a;     // false
```

## 2. 整型（int/uint）
### 无符号整型（uint）
表示非负整数，可以指定位宽（uint8、uint16、uint256...）,默认是 uint256。
```
uint public myUint;      // 默认 uint256
uint8 public myUint8;
uint16 public myUint16;
uint256 public myUint256;
```
### 有符号整型（int）
表示正负整数，可以指定位宽（int8、int16、uint256），默认 int256。
```
int public myInt;        // 默认 int256
int8 public myInt8;
int16 public myInt16;
int256 public myInt256;
```
> **相关安全问题：**
> Solidity 0.8.0 之前整型溢出和下溢是一个常见的问题，为了处理这个问题引入了 safeMath 库；在 solidity  0.8.0 开始，整型运算默认包含了溢出和下溢检查，而不再需要 safeMath 库。
> ```
> pragma solidity ^0.8.0;
> contract OverflowExample {
 >   uint8 public maxUint8 = 255;
  >   function increment() public {
  >   maxUint8 += 1; // 这将导致运行时错误，因为 uint8 的最大值是 255
 >    }
> }
> ```

## 3. 地址类型
- 表示以太坊地址
- 包含 address 和 address payable 两种，address payable 可以接受以太币
- 一个 Ethereum 地址是一个 20 字节（160 位）的值，通常用于表示账户（包括外部账户和合约账户）
```solidity
address contractAddress = 0x1234567890123456789012345678901234567890;
address payable recipient = payable(contractAddress);
```
**地址类型有一些特定的方法**
用于地址的检查、转账等操作。
| 方法 / 属性                           | 说明                                                             |
| --------------------------------- | -------------------------------------------------------------- |
| `balance`                         | 地址的以太币余额，如 `address.balance`                                   |
| `transfer(uint256 amount)`        | 向指定地址转账，如 `address.transfer(amount)`，转账失败会抛出异常                 |
| `send(uint256 amount)`            | 向指定地址转账，返回布尔值表示是否成功，如 `address.send(amount)`                   |
| `call(bytes memory data)`         | 低级别调用，可用于调用其他合约的函数或发送以太币，如 `address.call{value: amount}(data)` |
| `delegatecall(bytes memory data)` | 委托调用，调用其他合约的代码但使用当前合约的存储，如 `address.delegatecall(data)`        |
| `staticcall(bytes memory data)`   | 静态调用，不允许修改状态，如 `address.staticcall(data)`                      |

## 4. 定长字节数组（bytes1-bytes32）
- 它是一种特定长度的字节序列，长度在声明时就被固定了
- 用于存储固定长度的字节序列，长度从1到32字节
    ```
    bytes1 public byte1Array;   // 单个字节
    bytes2 public byte2Array;   // 两个字节
    bytes3 public byte3Array;   // 三个字节
    bytes32 public byte32Array; // 32 个字节
    ```
    
  **注意：**
  - 定长字节数组的元素可以像普通数组一样通过索引进行访问和赋值。
  - 但没有 .length 属性，因为他们的长度在声明时已经固定
  - 可以使用 keccak256 比较两个定长字节数组
      ```
      bytes2 public byte2Array1 = hex"1122";
    bytes2 public byte2Array2 = hex"3344";

    function compareArrays() public view returns (bool) {
        return keccak256(byte2Array1) == keccak256(byte2Array2);
    }
      ```
  - 当操作定长字节数组时，需要确保索引不超出数组的有效范围，以避免访问越界错误。 
  - 定长字节数组不支持动态大小调整，因此在使用时需要考虑到存储空间和 gas 成本。
## 5. 枚举类型（enum）
用于定义一组命名的常量值，可增强代码的可读性。
- 枚举的每个成员都会自动分配一个整数索引，从 0 开始递增。
- 枚举成员名称必须是唯一的。
- 枚举成员可以显式地指定数值，例如 enum State { A = 10, B = 20 }。
```solidity
enum Status { Pending, Completed, Cancelled }
Status currentStatus = Status.Pending;
```

## 6. 函数类型
表示函数的类型，可用于将函数作为参数传递或返回函数。有内部函数（只能在合约内部调用）和外部函数（可从合约外部调用）之分。
```solidity
function add(uint a, uint b) internal pure returns (uint) {
    return a + b;
}
function callAdd(function(uint, uint) internal pure returns (uint) func, uint x, uint y) internal pure returns (uint) {
    return func(x, y);
}
```

# 引用类型
引用类型的变量存储的是数据的引用，赋值或传递参数时传递的是引用而非整个数据。
用于存储复杂的数据结构或者允许通过引用传递的数据类型。
引用类型包括：变长字节数组、字符串类型、结构体、映射类型、数组。

## 1.变长字节数组（bytes）
用于存储可变长度的字节序列，可动态调整长度。
```solidity
bytes memory data = new bytes(10);
data[0] = 0x01;
```

## 2. 字符串类型
用于存储 UTF-8 编码的字符串，是变长字节数组的一种特殊形式。
```solidity
string memory message = "Hello, World!";
```
## 3. 结构体
- 结构体是一种自定义的复合数据类型，用于存储多个不同类型的数据。
- Solidity 中的结构体通过 struct 关键字来定义
```solidity
struct Person {
    string name;
    uint age;
}
Person memory person = Person("Alice", 25);
```
**结构体的使用**
结构体可以帮助开发者更有效地组织和管理复杂的数据。它们可以作为函数的参数或返回值，也可以作为其他结构体或映射的成员变量。下面是一些结构体的使用示例：
```
pragma solidity ^0.8.0;

contract StructUsageExample {
    struct Employee {
        string name;
        uint age;
        address walletAddress;
    }

    mapping(address => Employee) public employees;

    // 添加新员工
    function addEmployee(address _employeeAddress, string memory _name, uint _age, address _walletAddress) public {
        employees[_employeeAddress] = Employee(_name, _age, _walletAddress);
    }

    // 获取员工信息
    function getEmployee(address _employeeAddress) public view returns (string memory, uint, address) {
        Employee memory emp = employees[_employeeAddress];
        return (emp.name, emp.age, emp.walletAddress);
    }
}
```
**注意事项**
- 成员变量访问：结构体的成员变量可以通过点号 (.) 访问，例如 myPerson.name。
- 内存与存储：在函数内部使用结构体时，需要注意是否需要在存储区域（storage）或者内存区域（memory）中处理。
- 嵌套结构体：Solidity 支持结构体的嵌套定义，允许在一个结构体中包含另一个结构体作为成员变量。
- Gas 成本：对于复杂的结构体或者包含大量数据的结构体，需要注意 gas 成本和执行效率问题。
## 4. 映射类型
- 用于存储键值对
- 通过 mapping 关键字定义
```
mapping(address => uint) public balances;
```
### **映射的特性**
- 键类型：映射的键可以是任何值类型，包括基本类型（如 uint、address)。
- 值类型：映射的值可以是任何 Solidity 支持的数据类型，包括基本类型、复合类型（如 struct）和数组类型。
- 默认值：如果映射中不存在某个键对应的值，则返回该值类型的默认值。例如，uint 类型的默认值是 0，address 类型的默认值是 address(0)。
- Gas 成本：读取映射中的值（查找操作）是 gas 消耗较低的操作，而写入映射中的值（更新操作）可能会消耗更多的 gas，特别是在扩展映射时可能需要大量的 gas。

### 映射的使用场景
映射在 Solidity 合约中有广泛的应用，特别是用于管理状态数据、存储关联数据和实现查找表。以下是一些常见的应用场景：
- 存储账户余额：如上面示例所示，映射可以用来存储多个账户的余额信息。
- ERC20 Token 实现：映射通常用于存储 ERC20 Token 的余额和授权信息。
- 存储关联数据：映射可以用于存储任何需要通过某种键快速查找和访问的关联数据。
- 索引和查找：映射可以作为索引来优化查找和检索操作，例如根据地址查找合约用户的信息。
## 5. 数组
可存储相同类型元素的集合，有定长数组和变长数组之分。

数组在 Solidity 中也被视为引用类型，特别是动态大小的数组。动态大小的数组允许在运行时动态增加或减少其长度，这意味着它们的操作是基于引用的。

### 定长数组（type[N]）
定长数组在声明时就需要指定数组的长度 N，且长度不能更改。定长数组通常用于固定大小的数据集合，如固定数量的数据元素存储。

### 动态数组
动态数组是在 Solidity 中比较常见和灵活的数组类型，它的长度可以在运行时动态增加或减少。
```solidity
// 定长数组
uint[3] memory fixedArray = [1, 2, 3];
// 变长数组
uint[] memory dynamicArray = new uint[](5);
```
**特点及注意事项**
- gas成本：动态数组在增加元素时会消耗 gas，因此对于大型数组或频繁修改的数组操作，需要注意 gas 成本问题。
- 内存管理：动态数组在 Solidity 中会自动管理内存，无需手动释放或调整。
- 返回值：在 Solidity 中，函数不能返回完整的动态数组，如果需要返回数组，则通常需要返回数组的长度和元素的部分内容，或者使用外部函数接口。
- 多维数组
    ```
    uint[][] public multiArray;
    ```
    
    
# 其他拓展
## 常量
常量在 Solidity 中是指一旦声明后其值无法更改的数据。常量的声明方式是使用 constant 或 immutable 关键字。主要特点包括：
- 初始化后不可更改：常量在声明时需要立即赋值，并且其值在合约的生命周期内保持不变。
- 编译时确定：常量的值在编译时确定，并且在部署时被写入合约的字节码中。
- 不占用存储空间：常量不占用合约的存储空间，而是在代码中直接使用其值。
```
uint constant public MAX_NUMBER = 100;
```
## 变量
变量是 Solidity 中用于存储和管理数据的可变容器。主要特点包括：
- 可变性：变量在声明后可以根据需要进行修改和更新。
- 存储空间：变量会占用合约的存储空间，可以存储状态和临时数据。
- 作用域：变量可以是合约级别的状态变量，也可以是函数内的局部变量。
```
uint public count;
```
**使用建议**
- 常量 vs 变量：根据需求选择合适的常量或变量。常量适用于在合约中需要固定且不可变的值，而变量适用于需要存储和修改的动态数据。
- Gas 成本：读取常量的 gas 成本较低，因为它们的值在编译时已经确定；而更新变量或者读取状态变量可能会涉及更高的 gas 成本，尤其是在合约存储空间的使用方面。
- 安全性：在编写合约时，合理使用常量和变量可以提高合约的安全性和可读性，避免不必要的状态变化和复杂的逻辑。
## immutable
一次初始化之后不可以修改，定义成 immutable 的变量是可以节省 gas
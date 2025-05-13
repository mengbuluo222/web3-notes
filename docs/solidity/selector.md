# 函数选择器

## 定义
函数选择器（Function Selector）是 Solidity 中用于标识特定函数的机制。它是函数签名的哈希值的前 4 个字节，主要用于在低级调用（如 call、delegatecall，staticcall）中指定要调用的目标函数。

## 计算方式
函数选择器是通过对函数签名进行哈希计算得出的。函数签名是由函数名和参数类型组成的字符串，格式为 functionName(type1,type2,...)。以下是具体的计算步骤：
写出函数的完整签名，例如 transfer(address,uint256)。
运用 Keccak-256 哈希函数对函数签名进行哈希计算。
取哈希结果的前 4 个字节，这 4 个字节就是函数选择器。
## 示例
假设我们有一个名为 transfer 的函数，其签名为 transfer(address,uint256)。
计算函数选择器的步骤如下：

```
contract FunctionSelectorExample {
    function getFunctionSelector() public pure returns (bytes4) {
        return bytes4(keccak256("transfer(address,uint256)"));
    }
}
```
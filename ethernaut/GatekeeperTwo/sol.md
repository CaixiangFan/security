# Goal

Pass all gates through satisfying gate modifiers.

# Steps

1. Deploy this level.
2. Analyze the three gates:

- `gateOne` requires the transaction original sender is different from direct caller, meaning calling the `enter` function through another contract.
- `gateTwo` requires the contract size in address `caller()` to be zero. According to yellow paper section 7 `"During initialization code execution,EXTCODESIZE on the address should return zero,which is the length of the code of the account while CODESIZE should return the length of the initialization code"`
  Therefore, `enter(bytes8)` function should be called in the attacker contract constructor.

- `gateThree` has the following requirement:
  ```
    require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == type(uint64).max);
  ```
  The bitwise XOR operation has the property such that given `A XOR B = C`, we have `B = A XOR C`. Therefore, `gateKey` can be easily calculated as:


  ```
    bytes8 gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max);

  ```
  Note `address(this)` is used instead of `msg.sender`, as `msg.sender` stands for the attacker contract in the target contract. To calculate the key inside attacker, it should be replaced as `address(this)`.


3.  Deploy the `GatekeeperTwoAttacker` contract to `Sepolia` o hack this level.

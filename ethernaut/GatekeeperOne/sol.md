# Goal

Pass all gates through satisfying gate modifiers.

# Steps

1. Deploy this level.
2. Analyze the three gates:

- `gateOne` requires the transaction original sender is different from direct caller, meaning calling the `enter` function through another contract.
- `gateThree` has three requirements. To properly go through them, we need to understand the concept of data type downcasting and upcasting along with bitmasking. Assume that we need to send the following value as our key - `0x B1 B2 B3 B4 B5 B6 B7 B8`.
  The first requirement asks us to satisfy the following condition:

  ```
  0x B5 B6 B7 B8 == 0x 00 00 B7 B8

  ```

  The second requirement is:

  ```
  0x 00 00 00 00 B5 B6 B7 B8 != 0x B1 B2 B3 B4 B5 B6 B7 B8
  ```

  The third requirement is:

  ```
  0x B5 B6 B7 B8 == 0x 00 00 (last two bytes of tx.origin)

  ```

  Therefore, the gatekey should have a form of:

  ```
  0x ANY_DATA ANY_DATA ANY_DATA ANY_DATA 00 00 SECOND_LAST_BYTE_OF_ADDRESS LAST_BYTE_OF_ADDRESS
  ```

  We use bitwise operation to generate the gate key from our `tx.origin`:

  ```
  bytes8(uint64(uint160(tx.origin)) & 0xFFFFFFFF0000FFFF
  ```

- `gateTwo` requires `gasleft() % 8191 == 0`. We need to bruteforce the function and increment the gas in each function call until one of the values hits the spot.

  ```
    for (uint256 i = 0; i < 300; i++) {
      (bool success, ) = address(challenge).call{gas: i + (8191 * 3)}(abi.encodeWithSignature("enter(bytes8)", _gateKey));
      if (success) {
          break;
      }
    }
  ```

  The reasons why low level call is used rather than direct function call `challenge.enter(_gateKey)`:

  - Reverts are not bubbled up
  - Type checks are bypassed
  - Function existence checks are omitted

3.  Deploy the `GatekeeperOneAttacker` contract to `Sepolia` and call `exploit` to hack this level.

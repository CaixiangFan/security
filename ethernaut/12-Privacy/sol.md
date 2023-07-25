# Goal

Get the private key from storage slot and set `locked` state variable to `false`.

# Steps

1. Deploy this level.
2. Analyze the storage of this contract:

- `locked` is 1 byte bool in slot 0
- `ID` is a 32 byte uint256. It is 1 byte extra big to be inserted in slot 0. So it goes in & totally fills slot 1
- `flattening` - a 1 byte uint8, `denomination` - a 1 byte uint8 and `awkwardness` - a 2 byte uint16 totals 4 bytes. So, all three of these go into slot 2
- Array data always start a new slot, so `data` starts from slot 3. Since it is bytes32 array each value takes 32 bytes. Hence value at index 0 is stored in slot 3, index 1 is stored in slot 4 and index 2 value goes into slot 5

  So, the key is in slot 5 (index 2 / third entry).

3.  Read the key using `web3.eth.getStorageAt()` function.

    ```
     const key = await web3.eth.getStorageAt(process.env.PRIVACY_COUNTRACT, 5);
    ```

4.  Trim the key to get the first 16 bytes as the final key.

    ```
    const trim_key = key.slice(0, 34);
    ```

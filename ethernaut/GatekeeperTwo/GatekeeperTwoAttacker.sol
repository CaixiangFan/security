// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGatekeeperTwo {
  function enter(bytes8 _gateKey) external returns(bool);
}

contract GatekeeperTwoAttacker {

    IGatekeeperTwo public challenge;

    constructor(address challengeAddress) {
        challenge = IGatekeeperTwo(challengeAddress);
        bytes8 gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max);
        challenge.enter(gateKey);
    }
}

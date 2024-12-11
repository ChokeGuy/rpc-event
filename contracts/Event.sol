// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.27;


contract Event {
    event Send(address indexed from,address indexed to,string message);

    function sendMessage(address _to,string calldata message) external{
        emit Send(msg.sender,_to,message);
    }
}
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract John2 {

  mapping(address => uint256) private _balances;
  mapping (address => mapping (address => uint256)) private _allowances;

  string private _name;
  string private _symbol;
  uint256 private _totalSupply;
  address private _owner;

  event Transfer(address indexed sender, address indexed receipient, uint256 amount);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);


  constructor(address owner_, uint256 totalSupply_) {
    _name = "JohnYolo";
    _symbol = "JOHN2";
    _owner = owner_;
    _balances[owner_] = totalSupply_;
    emit Transfer(address(0), owner_, totalSupply_);
  }

  function transfer(address recipient, uint256 amount) public returns (bool) {
    require(_balances[msg.sender] >= amount, 'John2: transfer amount exceed balance');

    _balances[msg.sender] -= amount;
    _balances[recipient] += amount;
    emit Transfer(msg.sender, recipient, amount);
    return true;
  }

  function approve(address spender, uint256 amount) public returns (bool) {
    _allowances[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address spender,address recipient, uint256 amount) public returns (bool) {
    require(amount <= _allowances[spender][msg.sender], "John2: the amount exceed your allowance");
    require(amount <= _balances[spender], "John2: the amount exceed the balance of the sender");
    
    _balances[spender] -= amount;
    _allowances[spender][msg.sender] -= amount;
    _balances[recipient] += amount;

    emit Transfer(spender, recipient, amount);
    return true;
  }

  function name() public view returns(string memory) {
    return (_name);
  }

  function symbol() public view returns(string memory) {
    return (_symbol);
  }

  // function decimals() public view returns (uint8) {
  //   return 
  // }

  function totalSupply() public view returns(uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view returns(uint256 balance) {
    return (_balances[account]);
  }

}

  

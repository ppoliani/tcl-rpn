# tcl-rpn
A library that deals with RPN expressions suitable for the TCL compliance protocol

# Installation

```
npm install tcl-rpn
yarn add tcl-rpn
```

# Usage

```
console.log(postfix('A AND B OR ( C AND D )')) // A B AND C D AND OR postfix
console.log(infix('A B AND C D AND OR')) // A AND B OR ( C AND D ) infix

console.log(postfix('A AND B OR ( C AND D ) AND ( F OR D )'))
console.log(infix('A B AND C D AND OR F D OR AND'));

console.log(postfix('A AND ( B OR C ) AND D'))
console.log(infix('A B C OR AND D AND'));
```

Currently it supports the `AND` and `OR` operators. 
Note! the logical expression should have spaces between the each token.

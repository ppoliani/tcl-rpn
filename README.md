# tcl-rpn
A library that deals with RPN expressions suitable for the TCL compliance protocol

# Installation

```
npm install tcl-rpn
yarn add tcl-rpn
```

# Usage

```
rpn('A AND B OR ( C AND D )')
```

Currently it supports the `AND` and `OR` operators. 
Note! the logical expression should have spaces between the each token.

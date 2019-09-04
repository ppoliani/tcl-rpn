const tokenize = expression => expression.split(' ');

const isOperator = (operators, token) => Boolean(operators.find(o => o.name === token));
const getPrecedence = (operators, token) => {
  if(token === '(') return 0;
  return operators.find(o => o.name === token).precedence;
}

const stateTransition = (stack, result) => ({stack, result});

const processToken = (
  operators, 
  stack, 
  result, 
  token
) => {
  switch(true) {
    case isOperator(operators, token):
      return processOperator(operators, stack, result, token);
    case token === '(':
      return stateTransition(processOpeningParenthesis(stack, token), result);
    case token === ')':
      return processClosingParenthesis(stack, result);
    default:
      return stateTransition(stack, processOperand(result, token))

  }
}

const peek = stack => stack[stack.length - 1];

const processOperator = (operators, stack, result, token) => {
  let topItem = peek(stack);

  while (isOperator(operators, topItem) && getPrecedence(operators, topItem) >= getPrecedence(operators, token)) {
    result = push(result, pop(stack));
    topItem = peek(stack);
  }

  return {
    stack: push(stack, token),
    result
  }
}

const processOperand = (result, token) => push(result, token);

const processOpeningParenthesis = (stack, token) => push(stack, token);

const processClosingParenthesis = (stack, result) => {
  while (peek(stack) !== '(') {
    result = push(result, pop(stack));
  }

  pop(stack);

  return {stack, result};
}

const pop = stack => stack.pop();
const push = (stack, val) => [...stack, val];

const reduceExpression = (stack, result) => {
  while (stack.length) {
    result = [...result, pop(stack)]
  }

  return result.join(' ');
}

const validatePostfix = (expr, operators) => {
  const throwError = () => {
    throw new Error('Invalid expression');
  }

  const increment = counter => counter + 1;
  const decrement = counter => {
    let ret = counter - 1;

    if(ret < 0) {
      throwError();
    }

    return ret;
  }

  const counter = tokenize(expr).reduce((counter, token) => {
    switch(true) {
      case isOperator(operators, token):
        counter = decrement(counter);
        counter = decrement(counter);
        return increment(counter);
      case token === '(' || token === ')':
        throwError();
      default:
        return increment(counter);
    }
  }, 0)

  if(counter !== 1) {
    throwError();
  }

  return expr;
}

const postfix = (infix, options={}) => {
  const {operators =  [
    {name: 'AND', precedence: 1},
    {name: 'OR', precedence: 1}
  ]} = options;

  let result = [];
  let stack = [];

  tokenize(infix).forEach(token => {
    const ret = processToken(operators, stack, result, token);

    result = ret.result;
    stack = ret.stack;
  });

  return validatePostfix(reduceExpression(stack, result), operators);

}

const infix = (postfix, options={}) => {
  const {operators =  [
    {name: 'AND', precedence: 2},
    {name: 'OR', precedence: 1}
  ]} = options;

  let stack = [];

  tokenize(postfix).forEach(token => {
    if(!isOperator(operators, token)) {
      stack = push(stack, token);
    }
    else {
      let firstItem = pop(stack);
      let secondItem = pop(stack);

      const operandOneOperator = firstItem.split(' ')[1];
      const operandTwoOperator = secondItem.split(' ')[1];

      if(!!operandTwoOperator && getPrecedence(operators, operandTwoOperator) < getPrecedence(operators, token)) {
        secondItem = `( ${secondItem} )`
      }

      if(!!operandOneOperator && getPrecedence(operators, operandOneOperator) <= getPrecedence(operators, token)) {
        firstItem = `( ${firstItem} )`
      }

      const result = `${secondItem} ${token} ${firstItem}`;
      stack = push(stack, result);
    }
  });

  return peek(stack);
}


module.exports = {
  postfix,
  infix
};

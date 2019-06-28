const tokenize = expression => expression.split(' ');

const isOperator = (operators, token) => Boolean(operators.find(o => o.name === token));
const getPrecedence = (operators, token) => {
  if(token === '(') return 0;
  return operators.find(o => o.name === token).precedence;
}
const isStackEmpty = stack => stack.length ==- 0;

const stateTransition = (stack, result) => ({stack, result});

const processToken = (
  operators, 
  stack, 
  result, 
  token
) => {
  if(isOperator(operators, token)) {
    return processOperator(operators, stack, result, token);
  }
  if(token === '(') {
    return stateTransition(processOpeningParenthesis(stack, token), result);
  }
  if(token === ')') {
    return processClosingParenthesis(stack, result);
  }
  else {
    return stateTransition(stack, processOperand(result, token))
  }
}

const peek = stack => stack[stack.length - 1];

const processOperator = (operators, stack, result, token) => {
  let topItem = peek(stack);

  while (isOperator(operators, topItem) && getPrecedence(operators, topItem) >= getPrecedence(operators, token)) {
    result = [...result, stack.pop()];
    topItem = peek(stack);
  }

  return {
    stack: [...stack, token],
    result
  }
}

const processOperand = (result, token) => [...result, token];;

const processOpeningParenthesis = (stack, token) => [...stack, token];

const processClosingParenthesis = (stack, result) => {
  while (peek(stack) !== '(') {
    result = [...result, stack.pop()];
  }

  stack.pop();

  return {stack, result};
}

const reduceExpression = (stack, result) => {
  while (stack.length) {
    result = [...result, stack.pop()]
  }

  return result.join(' ');
}

const rpn = (expression, options) => {
  const {operators = ['*','/','+','-']} = options;

  let result = [];
  let stack = [];

  tokenize(expression).forEach(token => {
    const ret = processToken(operators, stack, result, token);

    result = ret.result;
    stack = ret.stack;
  });

  return reduceExpression(stack, result);
}

const opts = {
  operators: [
    {name: 'AND', precedence: 1},
    {name: 'OR', precedence: 1}
  ]
}

console.log(rpn('A AND B OR ( C AND D )', opts));

module.exports = {rpn};

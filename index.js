const tokenize = expression => expression.split(' ');

const isOperator = (operators, token) => Boolean(operators.find(o => o.name === token));
const getPrecedence = (operators, token) => operators.find(o => o.name === token).precedence;
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
    return stateTransition(stack, processOpeningParenthesis(stack, token)) 
  }
  if(token === ')') {
    processClosingParenthesis();
  }
  else {
    return stateTransition(stack, processOperand(result, token))
  }
}

const processOperator = (operators, stack, result, token) => {
  while (!isStackEmpty(stack)) {
    const topItem = stack.pop();

    if(getPrecedence(operators, token) >= getPrecedence(operators, topItem)) {
      result = [...result, topItem];
    }
  }

  return {
    stack: [...stack, token],
    result
  }
}

const processOperand = (result, token) => [...result, token];;

const processOpeningParenthesis = (stack, token) => [...stack, token];

const processClosingParenthesis = (stack, result) => {
  let item = stack.pop();

  while (item !== '(') {
    result = [...result, item];
    item = stack.pop();
  }

  item = stack.pop();
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

console.log(rpn('A AND B OR (C AND D)', opts));

module.exports = {rpn};

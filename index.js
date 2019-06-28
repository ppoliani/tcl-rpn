const partial = (fn, ...args) => (...restArgs) => fn.apply(this, args.concat(restArgs));
const tokenize = expression => expression.split(' ');

const isOperator = (operators, token) => Boolean(operators.find(token));
const getPrecedence = operator => operator.precedence;
const isStackEmpty = stack => stack.length ==- 0;

const stateTransition = (stack, result) => ({stack, result});

const processToken = (
  operators, 
  stack, 
  result, 
  token
) => {
  if(isOperator(operators, token)) {
    return processOperator(token);
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

const processOperator = (stack, result, token) => {
  while (!isStackEmpty()) {
    const topItem = stack.pop();

    if(getPrecedence(token) >= getPrecedence(topItem)) {
      return {
        stack,
        result: [...result, topItem]
      }
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

const createRpnExpression = (stack, result) => {
  while (stack.length) {
    result = [...result, stack.pop()]
  }

  return result.join(' ');
}

const rpn = (expression, options) => {
  const {operators = ['*','/','+','-']} = options;

  let result = [];
  let stack = [];

  tokenize(tokens).forEach(token => {
    ({result, stack}) = processToken(operators, stack, result, token);
  });

  return createRpnExpression(stack);
}

module.exports = {rpn};

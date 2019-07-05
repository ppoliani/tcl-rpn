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

const postfix = (expression, options={}) => {
  const {operators =  [
    {name: 'AND', precedence: 1},
    {name: 'OR', precedence: 1}
  ]} = options;

  let result = [];
  let stack = [];

  tokenize(expression).forEach(token => {
    const ret = processToken(operators, stack, result, token);

    result = ret.result;
    stack = ret.stack;
  });

  return reduceExpression(stack, result);
}

const infix = (expression, options={}) => {
  const {operators =  [
    {name: 'AND', precedence: 1},
    {name: 'OR', precedence: 1}
  ]} = options;

  let stack = [];

  tokenize(expression).forEach(token => {
    if(!isOperator(operators, token)) {
      stack = push(stack, token);
    }
    else {
      const topItem = pop(stack);
      const pushVal = `(${pop(stack)} ${token} ${topItem})`;
      stack = push(stack, pushVal);
    }
  });

  return peek(stack);
}

console.log(postfix('A AND B OR ( C AND D )')) // A B AND C D AND OR postfix
console.log(infix('A B AND C D AND OR')) // A AND B OR ( C AND D ) infix

module.exports = {
  postfix,
  infix
};

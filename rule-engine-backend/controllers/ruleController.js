const Rule = require('../models/Rule');

// Helper function to create an AST from a rule string
function createRule(ruleString) {
    // Trim whitespace and ensure consistent spacing around operators
    const trimmedRuleString = ruleString.trim();
    const formattedRuleString = trimmedRuleString
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .replace(/([><=]+)/g, ' $1 ')
        .trim();

    const tokens = formattedRuleString.split(/\s+/);

    let ast = {
        type: 'AND', // Default type
        conditions: [],
    };

    let currentCondition = { type: 'AND', conditions: [] };
    let conditionStack = [currentCondition];

    // Loop through tokens to build the AST
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token === '(') {
            // Create a new nested condition and push it onto the stack
            const nestedCondition = { type: 'AND', conditions: [] };
            conditionStack[conditionStack.length - 1].conditions.push(nestedCondition);
            conditionStack.push(nestedCondition);
        } else if (token === ')') {
            // Pop the top condition from the stack when encountering ')'
            conditionStack.pop();
            if (conditionStack.length === 0) {
                throw new Error('Mismatched parentheses in rule string.');
            }
        } else if (['AND', 'OR'].includes(token.toUpperCase())) {
            // Set the current condition's type
            conditionStack[conditionStack.length - 1].type = token.toUpperCase();
        } else {
            // Parse a condition (operand, operator, operand)
            const leftOperand = token;
            const operator = tokens[++i];
            const rightOperand = tokens[++i]?.replace(/['"]+/g, '');

            if (!leftOperand || !operator || !rightOperand) {
                throw new Error('Invalid rule format. Each condition should include a left operand, an operator, and a right operand.');
            }

            const condition = {
                leftOperand,
                operator,
                rightOperand,
            };

            conditionStack[conditionStack.length - 1].conditions.push(condition);
        }
    }

    // After processing all tokens, there should be only the root condition left in the stack
    if (conditionStack.length !== 1) {
        throw new Error('Mismatched parentheses in rule string.');
    }

    ast = conditionStack[0];

    // Validate the final AST
    if (!['AND', 'OR'].includes(ast.type) || ast.conditions.length === 0) {
        throw new Error('Invalid AST structure. Type must be "AND" or "OR", and conditions must not be empty.');
    }

    return ast;
}  

// Helper function to combine multiple rules into a single AST
function combineRules(rules) {
  const combinedAST = {
    type: 'AND',
    conditions: [],
  };

  rules.forEach((rule) => {
    try {
      const ruleAST = createRule(rule.rule);
      combinedAST.conditions.push(...ruleAST.conditions);
    } catch (error) {
      throw new Error(`Failed to parse rule: ${rule.rule}. ${error.message}`);
    }
  });

  // Check if any conditions were added
  if (!combinedAST.conditions.length) {
    throw new Error('No conditions found in combined rules.');
  }

  return combinedAST;
}



function evaluateAST(ast, data) {
    if (!ast || !ast.type || (ast.type !== 'AND' && ast.type !== 'OR')) {
      throw new Error('Invalid AST type. The AST type must be "AND" or "OR".');
    }
  
    if (ast.type === 'AND') {
      return ast.conditions.every((condition) =>
        condition.conditions ? evaluateAST(condition, data) : evaluateCondition(condition, data)
      );
    } else if (ast.type === 'OR') {
      return ast.conditions.some((condition) =>
        condition.conditions ? evaluateAST(condition, data) : evaluateCondition(condition, data)
      );
    } else {
      throw new Error('Invalid AST type. Expected "AND" or "OR".');
    }
  }
  

function evaluateCondition(condition, data) {
    const { leftOperand, operator, rightOperand } = condition;
    const value = data[leftOperand]; // Get the value from userData using the leftOperand

    console.log(`Evaluating condition: ${leftOperand} ${operator} ${rightOperand} with user value: ${value}`);

    if (value === undefined) {
        console.error(`Error: No matching key '${leftOperand}' in userData:`, data);
    }

    switch (operator) {
        case '>':
            return Number(value) > Number(rightOperand);
        case '<':
            return Number(value) < Number(rightOperand);
        case '>=':
            return Number(value) >= Number(rightOperand);
        case '<=':
            return Number(value) <= Number(rightOperand);
        case '=':
            return value == rightOperand; // Non-strict equality for simplicity
        case '!=':
            return value != rightOperand; // Non-strict inequality for simplicity
        default:
            throw new Error(`Invalid operator: ${operator}`);
    }
}

  
// Controller function to create a rule
exports.createRule = async (req, res) => {
  const { rule, description } = req.body;

  try {
    // Validate and create the AST
    const ast = createRule(rule);

    // Save the rule in the database
    const newRule = new Rule({ rule, description, ast });
    await newRule.save();

    res.status(201).json({ message: 'Rule created successfully.', ruleId: newRule._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to combine rules
exports.combineRules = async (req, res) => {
  try {
    const rules = await Rule.find(); // Fetch all saved rules from the database
    const combinedAST = combineRules(rules);

    res.status(200).json({ ast: combinedAST });
  } catch (error) {
    res.status(500).json({ message: 'Failed to combine rules. ' + error.message });
  }
};

// Controller function to evaluate a rule
exports.evaluateRule = (req, res) => {
  const { userData, ast } = req.body;
    
  // Validate the AST before proceeding
  console.log('Received UserData:', userData);
  console.log('Received AST:', ast);

  try {
    // Evaluate the rule against user data
    const result = evaluateAST(ast, userData); // Use evaluateAST instead of evaluateRule

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: 'Failed to evaluate rule. ' + error.message });
  }
};



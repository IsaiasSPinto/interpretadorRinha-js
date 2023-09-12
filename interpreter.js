var file = require("fs");

var json = file.readFileSync("examples/funcao.json");

var { expression } = JSON.parse(json);

const env = {};

function binaryOprator(op, lhs, rhs) {
  switch (op) {
    case "Add":
      return lhs + rhs;
    case "Sub":
      return lhs - rhs;
    case "Mul":
      return lhs * rhs;
    case "Div":
      return lhs / rhs;
    case "Rem":
      return lhs % rhs;
    case "Eq":
      return lhs == rhs;
    case "Neq":
      return lhs != rhs;
    case "Lt":
      return lhs < rhs;
    case "Gt":
      return lhs > rhs;
    case "Lte":
      return lhs <= rhs;
    case "Gte":
      return lhs >= rhs;
    case "And":
      return lhs & rhs;
    case "Or":
      return lhs | rhs;
    default:
      throw new Error("Invalid Operator");
  }
}


function interpret(obj,scope = {}) {
  switch (obj.kind) {
    case "Str":
      return obj.value;
    case "Int":
      return obj.value;
    case "Bool":
      return obj.value;
    case "Binary":
      return binaryOprator(obj.op, interpret(obj.lhs,scope), interpret(obj.rhs,scope));
    case "Print":
      console.log(interpret(obj.value,scope));
      break;
    case "Let":
      env[obj.name.text] = interpret(obj.value,scope);
      return interpret(obj.next,scope);
    case "Var":
      let value = env[obj.text];
        if (value === undefined) {
            value = scope[obj.text];
        }
      return value;
    case "Function":
        var fn = {
            body: obj.value,
            parameters: obj.parameters,
            env: {...env}
        }
        return fn;
    case "Call":
        var fn = interpret(obj.callee,scope);
        let newScope = {...fn.env};

        fn.parameters.forEach((param, index) => {
            newScope[param.text] = interpret(obj.arguments[index],scope);
        });

        return interpret(fn.body, newScope);
    case "If":
        if (interpret(obj.condition,scope)) {
            return interpret(obj.then,scope);
        }
        return interpret(obj.otherwise,scope);
    default:
      throw new Error("Invalid Expression");
  }
}

interpret(expression);

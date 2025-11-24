
export interface FieldNode {
    type: "field",
    field: string;
    func?: "to_int" | "exists";
}

export interface ValueNode {
    type: "value";
    value: any;
    func?: "to_int";
}

export interface ExpressionNode {
    type: "expr";
    field: string;
    func?: "to_int" | "exists";
    expr: string;
}

export type OperandNode = FieldNode | ValueNode | ExpressionNode;

export interface ConditionBlock {
    logic_link: "None" | "AND" | "OR";
    left: OperandNode;
    operator: ">" | "<" | ">=" | "<=" | "==" | "!=";
    right: OperandNode;
}

export interface CommonCondition {
    message: string;
    conditions: ConditionBlock[];
}

class ExpressionEvaluator {
    evaluate(expr: string): number {
        return Function(`"use strict"; return (${expr})`) ();
    }
}

export class Validator {
    private rules: CommonCondition[];
    private flatDataArray: Record<string, any>[];

    constructor(rules: CommonCondition[], inputData: Record<string, any>) {
        this.rules = rules;

        this.flatDataArray = Object.values(inputData).map(entry => {
            const flat: Record<string, any> = {};
            for (const key in entry) {
                flat[key] = entry[key];
            }
            return flat;
        });
    }

    private applyFunc(value: any, func?: string){
        switch (func) {
            case ("to_int"): return parseInt(value, 10);
            case ("exists"): return value !== undefined && value !== null;
            default: return value;
        }
    }

    private compare(left: any, operator: string, right: any): boolean {
        switch (operator) {
            case ">" : return left > right;
            case "<" : return left < right;
            case ">=" : return left >= right;
            case "<=" : return left <= right;
            case "==" : return left == right;
            case "!=" : return left != right;
            default: return false;
        }
    }

    private evalNode(node: OperandNode, data: Record<string, any>) {
        switch (node.type) {
            case "field":
                let fieldVal = data[node.field];
                if (fieldVal == null) fieldVal = 0;
                return this.applyFunc(fieldVal, node.func);
            
            case "value":
                return this.applyFunc(node.value, node.func);

            case "expr":
                let val = 0;
                try {
                    val = data[node.field];
                } catch {
                    val = 0;
                }
               
                if (val == null) val = 0;
                if (node.func) val = this.applyFunc(val, node.func);

                const exprStr = node.expr.replace(/field/g, val.toString());
                const evaluator = new ExpressionEvaluator();
                return evaluator.evaluate(exprStr);
            
            default:
                throw new Error("Неизвестный тип ноды");
        }
    }

    validate() : string[] {
        const errors: string[] = [];

        for (const data of this.flatDataArray)
        {
            for (const rule of this.rules) {
                let result = true;

                for (const block of rule.conditions) {
                    const leftVal = this.evalNode(block.left, data);
                    const rightVal = this.evalNode(block.right, data);
                    const blockResult = this.compare(leftVal, block.operator, rightVal);
                    switch (block.logic_link) {
                        case "None": 
                            result = blockResult;
                            break;
                        case "AND": 
                            result = result && blockResult;
                            break;
                        case "OR": 
                            result = result || blockResult;
                            break;
                    }
                }

                if (result) errors.push(rule.message);
            }
        }

        return errors;
    }
}
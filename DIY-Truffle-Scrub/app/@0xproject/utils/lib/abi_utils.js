"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("@0xproject/types");
var _ = require("lodash");
exports.abiUtils = {
    parseFunctionParam: function (param) {
        var _this = this;
        if (param.type === 'tuple') {
            // Parse out tuple types into {type_1, type_2, ..., type_N}
            var tupleComponents = param.components;
            var paramString = _.map(tupleComponents, function (component) { return _this.parseFunctionParam(component); });
            var tupleParamString = "{" + paramString + "}";
            return tupleParamString;
        }
        return param.type;
    },
    getFunctionSignature: function (methodAbi) {
        var _this = this;
        var functionName = methodAbi.name;
        var parameterTypeList = _.map(methodAbi.inputs, function (param) { return _this.parseFunctionParam(param); });
        var functionSignature = functionName + "(" + parameterTypeList + ")";
        return functionSignature;
    },
    /**
     * Solidity supports function overloading whereas TypeScript does not.
     * See: https://solidity.readthedocs.io/en/v0.4.21/contracts.html?highlight=overload#function-overloading
     * In order to support overloaded functions, we suffix overloaded function names with an index.
     * This index should be deterministic, regardless of function ordering within the smart contract. To do so,
     * we assign indexes based on the alphabetical order of function signatures.
     *
     * E.g
     * ['f(uint)', 'f(uint,byte32)']
     * Should always be renamed to:
     * ['f1(uint)', 'f2(uint,byte32)']
     * Regardless of the order in which these these overloaded functions are declared within the contract ABI.
     */
    renameOverloadedMethods: function (inputContractAbi) {
        var _this = this;
        var contractAbi = _.cloneDeep(inputContractAbi);
        var methodAbis = contractAbi.filter(function (abi) { return abi.type === types_1.AbiType.Function; });
        // Sort method Abis into alphabetical order, by function signature
        var methodAbisOrdered = _.sortBy(methodAbis, [
            function (methodAbi) {
                var functionSignature = _this.getFunctionSignature(methodAbi);
                return functionSignature;
            },
        ]);
        // Group method Abis by name (overloaded methods will be grouped together, in alphabetical order)
        var methodAbisByName = {};
        _.each(methodAbisOrdered, function (methodAbi) {
            (methodAbisByName[methodAbi.name] || (methodAbisByName[methodAbi.name] = [])).push(methodAbi);
        });
        // Rename overloaded methods to overloadedMethodName1, overloadedMethodName2, ...
        _.each(methodAbisByName, function (methodAbisWithSameName) {
            _.each(methodAbisWithSameName, function (methodAbi, i) {
                if (methodAbisWithSameName.length > 1) {
                    var overloadedMethodId = i + 1;
                    var sanitizedMethodName_1 = "" + methodAbi.name + overloadedMethodId;
                    var indexOfExistingAbiWithSanitizedMethodNameIfExists = _.findIndex(methodAbis, function (currentMethodAbi) { return currentMethodAbi.name === sanitizedMethodName_1; });
                    if (indexOfExistingAbiWithSanitizedMethodNameIfExists >= 0) {
                        var methodName = methodAbi.name;
                        throw new Error("Failed to rename overloaded method '" + methodName + "' to '" + sanitizedMethodName_1 + "'. A method with this name already exists.");
                    }
                    methodAbi.name = sanitizedMethodName_1;
                }
            });
        });
        return contractAbi;
    },
};
//# sourceMappingURL=abi_utils.js.map
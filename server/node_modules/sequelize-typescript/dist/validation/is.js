"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Is = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
function Is(...args) {
    const options = {};
    const argIsFunction = typeof args[0] === 'function';
    if (argIsFunction || (typeof args[0] === 'string' && typeof args[1] === 'function')) {
        let validator;
        let name;
        if (argIsFunction) {
            validator = args[0];
            name = validator.name;
            if (!name)
                throw new Error(`Passed validator function must have a name`);
        }
        else {
            name = args[0];
            validator = args[1];
        }
        options[`is${name.charAt(0).toUpperCase() + name.substr(1, name.length)}`] = validator;
    }
    else {
        options.is = args[0];
    }
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: options,
    });
}
exports.Is = Is;
//# sourceMappingURL=is.js.map
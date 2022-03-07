"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFloat = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for valid floating point numbers
 */
function IsFloat(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isFloat: true,
        },
    });
}
exports.IsFloat = IsFloat;
//# sourceMappingURL=is-float.js.map
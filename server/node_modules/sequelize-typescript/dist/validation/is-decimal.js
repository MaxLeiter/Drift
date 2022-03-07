"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsDecimal = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for any numbers
 */
function IsDecimal(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isDecimal: true,
        },
    });
}
exports.IsDecimal = IsDecimal;
//# sourceMappingURL=is-decimal.js.map
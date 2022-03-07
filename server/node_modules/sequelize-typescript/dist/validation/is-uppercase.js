"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUppercase = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for uppercase
 */
function IsUppercase(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isUppercase: true,
        },
    });
}
exports.IsUppercase = IsUppercase;
//# sourceMappingURL=is-uppercase.js.map
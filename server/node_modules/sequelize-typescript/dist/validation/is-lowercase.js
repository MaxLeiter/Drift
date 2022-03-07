"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsLowercase = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for lowercase
 */
function IsLowercase(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isLowercase: true,
        },
    });
}
exports.IsLowercase = IsLowercase;
//# sourceMappingURL=is-lowercase.js.map
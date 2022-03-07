"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotContains = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Don't allow specific substrings
 */
function NotContains(value) {
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            notContains: value,
        },
    });
}
exports.NotContains = NotContains;
//# sourceMappingURL=not-contains.js.map
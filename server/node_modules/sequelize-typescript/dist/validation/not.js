"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Not = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Will not allow values, that match the string regex or real regex
 */
function Not(arg) {
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            not: arg,
        },
    });
}
exports.Not = Not;
//# sourceMappingURL=not.js.map
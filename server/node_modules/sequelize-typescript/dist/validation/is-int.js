"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsInt = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for valid integers
 */
function IsInt(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isInt: true,
        },
    });
}
exports.IsInt = IsInt;
//# sourceMappingURL=is-int.js.map
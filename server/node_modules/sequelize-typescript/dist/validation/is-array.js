"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsArray = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Will only allow arrays
 */
function IsArray(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isArray: true,
        },
    });
}
exports.IsArray = IsArray;
//# sourceMappingURL=is-array.js.map
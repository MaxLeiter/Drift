"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAlphanumeric = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Will only allow alphanumeric characters, so "_abc" will fail
 */
function IsAlphanumeric(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isAlphanumeric: true,
        },
    });
}
exports.IsAlphanumeric = IsAlphanumeric;
//# sourceMappingURL=is-alphanumeric.js.map
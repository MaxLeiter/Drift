"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIPv4 = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for IPv4 (129.89.23.1)
 */
function IsIPv4(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isIPv4: true,
        },
    });
}
exports.IsIPv4 = IsIPv4;
//# sourceMappingURL=is-ip-v4.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIP = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for IPv4 (129.89.23.1) or IPv6 format
 */
function IsIP(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isIP: true,
        },
    });
}
exports.IsIP = IsIP;
//# sourceMappingURL=is-ip.js.map
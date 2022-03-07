"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEmail = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Checks for email format (foo@bar.com)
 */
function IsEmail(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isEmail: true,
        },
    });
}
exports.IsEmail = IsEmail;
//# sourceMappingURL=is-email.js.map
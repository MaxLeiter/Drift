"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEmpty = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
function NotEmpty(...args) {
    if (args.length === 1) {
        const options = args[0];
        return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
            validate: {
                notEmpty: options,
            },
        });
    }
    else {
        const target = args[0];
        const propertyName = args[1];
        (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
            validate: {
                notEmpty: true,
            },
        });
    }
}
exports.NotEmpty = NotEmpty;
//# sourceMappingURL=not-empty.js.map
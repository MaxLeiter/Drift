"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotNull = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/**
 * Won't allow null
 */
function NotNull(target, propertyName) {
    (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            notNull: true,
        },
    });
}
exports.NotNull = NotNull;
//# sourceMappingURL=not-null.js.map
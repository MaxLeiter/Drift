"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUUID = void 0;
const attribute_service_1 = require("../model/column/attribute-service");
/*
 * Only allow uuids.
 * Version's regular expressions:
 * https://github.com/chriso/validator.js/blob/b59133b1727b6af355b403a9a97a19226cceb34b/lib/isUUID.js#L14-L19.
 */
function IsUUID(version) {
    return (target, propertyName) => (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
        validate: {
            isUUID: version,
        },
    });
}
exports.IsUUID = IsUUID;
//# sourceMappingURL=is-uuid.js.map
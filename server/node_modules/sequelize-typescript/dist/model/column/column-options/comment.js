"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const attribute_service_1 = require("../attribute-service");
/**
 * Sets the specified comment value for the annotated field
 */
function Comment(value) {
    return (target, propertyName) => {
        (0, attribute_service_1.addAttributeOptions)(target, propertyName, {
            comment: value,
        });
    };
}
exports.Comment = Comment;
//# sourceMappingURL=comment.js.map
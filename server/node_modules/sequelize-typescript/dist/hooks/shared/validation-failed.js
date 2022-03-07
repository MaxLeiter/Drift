"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailed = void 0;
const hooks_service_1 = require("./hooks-service");
function ValidationFailed(...args) {
    return (0, hooks_service_1.implementHookDecorator)('validationFailed', args);
}
exports.ValidationFailed = ValidationFailed;
//# sourceMappingURL=validation-failed.js.map
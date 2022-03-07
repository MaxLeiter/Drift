"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeValidate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeValidate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeValidate', args);
}
exports.BeforeValidate = BeforeValidate;
//# sourceMappingURL=before-validate.js.map
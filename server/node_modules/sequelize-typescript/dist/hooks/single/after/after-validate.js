"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterValidate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterValidate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterValidate', args);
}
exports.AfterValidate = AfterValidate;
//# sourceMappingURL=after-validate.js.map
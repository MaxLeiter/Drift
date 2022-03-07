"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeUpdate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeUpdate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeUpdate', args);
}
exports.BeforeUpdate = BeforeUpdate;
//# sourceMappingURL=before-update.js.map
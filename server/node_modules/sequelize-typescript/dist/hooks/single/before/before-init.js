"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeInit = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeInit(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeInit', args);
}
exports.BeforeInit = BeforeInit;
//# sourceMappingURL=before-init.js.map
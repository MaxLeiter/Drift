"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterDestroy = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterDestroy(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterDestroy', args);
}
exports.AfterDestroy = AfterDestroy;
//# sourceMappingURL=after-destroy.js.map
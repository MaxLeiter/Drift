"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterInit = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterInit(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterInit', args);
}
exports.AfterInit = AfterInit;
//# sourceMappingURL=after-init.js.map
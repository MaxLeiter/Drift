"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterUpdate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterUpdate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterUpdate', args);
}
exports.AfterUpdate = AfterUpdate;
//# sourceMappingURL=after-update.js.map
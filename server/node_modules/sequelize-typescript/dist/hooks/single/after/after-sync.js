"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterSync = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterSync(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterSync', args);
}
exports.AfterSync = AfterSync;
//# sourceMappingURL=after-sync.js.map
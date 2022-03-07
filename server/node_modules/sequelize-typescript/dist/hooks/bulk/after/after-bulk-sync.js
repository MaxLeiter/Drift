"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterBulkSync = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterBulkSync(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterBulkSync', args);
}
exports.AfterBulkSync = AfterBulkSync;
//# sourceMappingURL=after-bulk-sync.js.map
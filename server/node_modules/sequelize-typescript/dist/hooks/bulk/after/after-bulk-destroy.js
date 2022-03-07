"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterBulkDestroy = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterBulkDestroy(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterBulkDestroy', args);
}
exports.AfterBulkDestroy = AfterBulkDestroy;
//# sourceMappingURL=after-bulk-destroy.js.map
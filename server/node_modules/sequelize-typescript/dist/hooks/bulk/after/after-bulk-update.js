"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterBulkUpdate = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterBulkUpdate(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterBulkUpdate', args);
}
exports.AfterBulkUpdate = AfterBulkUpdate;
//# sourceMappingURL=after-bulk-update.js.map
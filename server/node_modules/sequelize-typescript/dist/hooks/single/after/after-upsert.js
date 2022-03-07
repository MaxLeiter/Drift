"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterUpsert = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterUpsert(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterUpsert', args);
}
exports.AfterUpsert = AfterUpsert;
//# sourceMappingURL=after-upsert.js.map
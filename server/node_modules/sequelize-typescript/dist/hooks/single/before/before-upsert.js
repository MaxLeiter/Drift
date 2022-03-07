"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeUpsert = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeUpsert(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeUpsert', args);
}
exports.BeforeUpsert = BeforeUpsert;
//# sourceMappingURL=before-upsert.js.map
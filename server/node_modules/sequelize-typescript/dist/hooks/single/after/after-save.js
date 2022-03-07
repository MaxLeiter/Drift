"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterSave = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function AfterSave(...args) {
    return (0, hooks_service_1.implementHookDecorator)('afterSave', args);
}
exports.AfterSave = AfterSave;
//# sourceMappingURL=after-save.js.map
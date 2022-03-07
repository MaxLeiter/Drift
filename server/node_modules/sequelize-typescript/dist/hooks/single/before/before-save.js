"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeSave = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeSave(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeSave', args);
}
exports.BeforeSave = BeforeSave;
//# sourceMappingURL=before-save.js.map
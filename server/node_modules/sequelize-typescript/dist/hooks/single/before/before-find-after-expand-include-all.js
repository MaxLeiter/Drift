"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeFindAfterExpandIncludeAll = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeFindAfterExpandIncludeAll(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeFindAfterExpandIncludeAll', args);
}
exports.BeforeFindAfterExpandIncludeAll = BeforeFindAfterExpandIncludeAll;
//# sourceMappingURL=before-find-after-expand-include-all.js.map
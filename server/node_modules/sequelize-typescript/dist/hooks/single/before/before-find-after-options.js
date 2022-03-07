"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeFindAfterOptions = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeFindAfterOptions(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeFindAfterOptions', args);
}
exports.BeforeFindAfterOptions = BeforeFindAfterOptions;
//# sourceMappingURL=before-find-after-options.js.map
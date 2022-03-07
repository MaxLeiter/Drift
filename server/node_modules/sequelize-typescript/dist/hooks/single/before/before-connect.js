"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeConnect = void 0;
const hooks_service_1 = require("../../shared/hooks-service");
function BeforeConnect(...args) {
    return (0, hooks_service_1.implementHookDecorator)('beforeConnect', args);
}
exports.BeforeConnect = BeforeConnect;
//# sourceMappingURL=before-connect.js.map
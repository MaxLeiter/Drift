"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scopes = void 0;
const scope_service_1 = require("./scope-service");
/**
 * Decorator for defining Model scopes
 */
function Scopes(scopesOrScopesGetter) {
    return (target) => {
        if (typeof scopesOrScopesGetter === 'function') {
            (0, scope_service_1.addScopeOptionsGetter)(target.prototype, {
                getScopes: scopesOrScopesGetter,
            });
        }
        else {
            (0, scope_service_1.addScopeOptions)(target.prototype, scopesOrScopesGetter);
        }
    };
}
exports.Scopes = Scopes;
//# sourceMappingURL=scopes.js.map
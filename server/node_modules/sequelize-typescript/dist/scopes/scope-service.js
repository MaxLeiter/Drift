"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScopeOptions = exports.addScopeOptions = exports.resolvesDeprecatedScopes = exports.setScopeOptionsGetters = exports.getScopeOptionsGetters = exports.addScopeOptionsGetter = exports.resolveScope = exports.resolveScopes = void 0;
const object_1 = require("../shared/object");
const model_service_1 = require("../model/shared/model-service");
const alias_inference_service_1 = require("../associations/alias-inference/alias-inference-service");
const SCOPES_KEY = 'sequelize:scopes';
const SCOPES_OPTIONS_KEY = 'sequelize:scopes-options';
/**
 * Resolves scopes and adds them to the specified models
 */
function resolveScopes(models) {
    models.forEach((model) => {
        (0, exports.resolvesDeprecatedScopes)(model);
        const { getDefaultScope, getScopes } = (0, exports.getScopeOptionsGetters)(model.prototype);
        let options = {};
        if (getDefaultScope) {
            options = Object.assign(Object.assign({}, options), { defaultScope: getDefaultScope() });
        }
        if (getScopes) {
            options = Object.assign(Object.assign({}, options), getScopes());
        }
        Object.keys(options).forEach((key) => (0, exports.resolveScope)(key, model, options[key]));
    });
}
exports.resolveScopes = resolveScopes;
const resolveScope = (scopeName, model, options) => {
    if (typeof options === 'function') {
        const fn = options;
        options = (...args) => (0, alias_inference_service_1.inferAlias)(fn(...args), model);
    }
    else {
        options = (0, alias_inference_service_1.inferAlias)(options, model);
    }
    model.addScope(scopeName, options, { override: true });
};
exports.resolveScope = resolveScope;
const addScopeOptionsGetter = (target, options) => {
    const currentOptions = (0, exports.getScopeOptionsGetters)(target) || {};
    (0, exports.setScopeOptionsGetters)(target, Object.assign(Object.assign({}, currentOptions), options));
};
exports.addScopeOptionsGetter = addScopeOptionsGetter;
const getScopeOptionsGetters = (target) => {
    const options = Reflect.getMetadata(SCOPES_OPTIONS_KEY, target);
    if (options) {
        return Object.assign({}, options);
    }
    return {};
};
exports.getScopeOptionsGetters = getScopeOptionsGetters;
const setScopeOptionsGetters = (target, options) => {
    Reflect.defineMetadata(SCOPES_OPTIONS_KEY, options, target);
};
exports.setScopeOptionsGetters = setScopeOptionsGetters;
/**
 * @deprecated
 */
const resolvesDeprecatedScopes = (model) => {
    const options = getScopeOptions(model.prototype) || {};
    Object.keys(options).forEach((key) => resolveDeprecatedScope(key, model, options[key]));
};
exports.resolvesDeprecatedScopes = resolvesDeprecatedScopes;
/**
 * Adds scope option meta data for specified prototype
 * @deprecated
 */
function addScopeOptions(target, options) {
    const _options = getScopeOptions(target) || {};
    setScopeOptions(target, (0, object_1.deepAssign)({}, _options, options));
}
exports.addScopeOptions = addScopeOptions;
/**
 * Returns scope option meta data from specified target
 * @deprecated
 */
function getScopeOptions(target) {
    const options = Reflect.getMetadata(SCOPES_KEY, target);
    if (options) {
        return (0, object_1.deepAssign)({}, options);
    }
}
exports.getScopeOptions = getScopeOptions;
/**
 * @deprecated
 */
function resolveDeprecatedScope(scopeName, model, options) {
    if (typeof options === 'function') {
        const fn = options;
        options = (...args) => (0, alias_inference_service_1.inferAlias)(fn(...args), model);
    }
    else {
        options = (0, alias_inference_service_1.inferAlias)((0, model_service_1.resolveModelGetter)(options), model);
    }
    model.addScope(scopeName, options, { override: true });
}
/**
 * Set scope option meta data for specified prototype
 * @deprecated
 */
function setScopeOptions(target, options) {
    Reflect.defineMetadata(SCOPES_KEY, options, target);
}
//# sourceMappingURL=scope-service.js.map
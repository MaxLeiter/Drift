"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHooks = exports.getHooks = exports.addHook = exports.implementHookDecorator = exports.installHooks = void 0;
require("reflect-metadata");
const HOOKS_KEY = 'sequelize:hooks';
/**
 * Installs hooks on the specified models
 */
function installHooks(models) {
    models.forEach((model) => {
        const hooks = getHooks(model);
        if (hooks) {
            hooks.forEach((hook) => {
                installHook(model, hook);
            });
        }
    });
}
exports.installHooks = installHooks;
/**
 * Implementation for hook decorator functions. These are polymorphic. When
 * called with a single argument (IHookOptions) they return a decorator
 * factory function. When called with multiple arguments, they add the hook
 * to the model’s metadata.
 */
function implementHookDecorator(hookType, args) {
    if (args.length === 1) {
        const options = args[0];
        return (target, propertyName) => addHook(target, hookType, propertyName, options);
    }
    else {
        const target = args[0];
        const propertyName = args[1];
        addHook(target, hookType, propertyName);
    }
}
exports.implementHookDecorator = implementHookDecorator;
/**
 * Adds hook meta data for specified model
 * @throws if applied to a non-static method
 * @throws if the hook method name is reserved
 */
function addHook(target, hookType, methodName, options = {}) {
    if (typeof target !== 'function') {
        throw new Error(`Hook method '${methodName}' is not a static method. ` +
            `Only static methods can be used for hooks`);
    }
    // make sure the hook name doesn’t conflict with Sequelize’s existing methods
    if (methodName === hookType) {
        throw new Error(`Hook method cannot be named '${methodName}'. That name is ` + `reserved by Sequelize`);
    }
    const hooks = getHooks(target) || [];
    hooks.push({
        hookType,
        methodName,
        options,
    });
    setHooks(target, hooks);
}
exports.addHook = addHook;
/**
 * Install a hook
 */
function installHook(model, hook) {
    if (hook.options && hook.options.name) {
        model.addHook(hook.hookType, hook.options.name, model[hook.methodName]);
        return;
    }
    model.addHook(hook.hookType, model[hook.methodName]);
}
/**
 * Returns hooks meta data from specified class
 */
function getHooks(target) {
    const hooks = Reflect.getMetadata(HOOKS_KEY, target);
    if (hooks) {
        return [...hooks];
    }
    return;
}
exports.getHooks = getHooks;
/**
 * Saves hooks meta data for the specified class
 */
function setHooks(target, hooks) {
    Reflect.defineMetadata(HOOKS_KEY, hooks, target);
}
exports.setHooks = setHooks;
//# sourceMappingURL=hooks-service.js.map
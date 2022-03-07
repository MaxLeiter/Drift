import 'reflect-metadata';
import { HookMeta } from './hook-meta';
import { HookOptions } from './hook-options';
import { SequelizeHooks } from 'sequelize/types/hooks';
import { ModelCtor } from '../../model/model/model';
/**
 * Installs hooks on the specified models
 */
export declare function installHooks(models: ModelCtor[]): void;
/**
 * Implementation for hook decorator functions. These are polymorphic. When
 * called with a single argument (IHookOptions) they return a decorator
 * factory function. When called with multiple arguments, they add the hook
 * to the model’s metadata.
 */
export declare function implementHookDecorator(hookType: keyof SequelizeHooks, args: any[]): Function | void;
/**
 * Adds hook meta data for specified model
 * @throws if applied to a non-static method
 * @throws if the hook method name is reserved
 */
export declare function addHook(target: any, hookType: keyof SequelizeHooks, methodName: string, options?: HookOptions): void;
/**
 * Returns hooks meta data from specified class
 */
export declare function getHooks(target: any): HookMeta[] | undefined;
/**
 * Saves hooks meta data for the specified class
 */
export declare function setHooks(target: any, hooks: HookMeta[]): void;

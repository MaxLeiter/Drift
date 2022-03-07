import { ModelCtor } from '../model/model/model';
import { ScopeOptions, ScopeOptionsGetters, ScopesOptions } from './scope-options';
/**
 * Resolves scopes and adds them to the specified models
 */
export declare function resolveScopes(models: ModelCtor[]): void;
export declare const resolveScope: (scopeName: string, model: ModelCtor, options: ScopesOptions) => void;
export declare const addScopeOptionsGetter: (target: any, options: ScopeOptionsGetters) => void;
export declare const getScopeOptionsGetters: (target: any) => ScopeOptionsGetters;
export declare const setScopeOptionsGetters: (target: any, options: ScopeOptionsGetters) => void;
/**
 * @deprecated
 */
export declare const resolvesDeprecatedScopes: (model: ModelCtor) => void;
/**
 * Adds scope option meta data for specified prototype
 * @deprecated
 */
export declare function addScopeOptions<TCreationAttributes, TModelAttributes>(target: any, options: ScopeOptions<TCreationAttributes, TModelAttributes>): void;
/**
 * Returns scope option meta data from specified target
 * @deprecated
 */
export declare function getScopeOptions<TCreationAttributes, TModelAttributes>(target: any): ScopeOptions<TCreationAttributes, TModelAttributes> | undefined;

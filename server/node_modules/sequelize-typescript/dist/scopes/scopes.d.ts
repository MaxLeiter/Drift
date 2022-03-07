import { ScopeTableOptions } from './scope-table-options';
import { ScopesOptionsGetter } from './scope-options';
/**
 * Decorator for defining Model scopes
 */
export declare function Scopes(scopesGetter: ScopesOptionsGetter): Function;
/**
 * Decorator for defining Model scopes
 * @deprecated
 */
export declare function Scopes<TCreationAttributes, TModelAttributes>(scopes: ScopeTableOptions<TCreationAttributes, TModelAttributes>): Function;

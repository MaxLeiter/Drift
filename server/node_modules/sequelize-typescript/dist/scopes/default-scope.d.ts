import { ScopeFindOptions } from './scope-find-options';
import { DefaultScopeGetter } from './scope-options';
/**
 * Decorator for defining default Model scope
 */
export declare function DefaultScope(scopeGetter: DefaultScopeGetter): Function;
/**
 * Decorator for defining default Model scope
 * @deprecated
 */
export declare function DefaultScope<TCreationAttributes, TModelAttributes>(scope: ScopeFindOptions<TCreationAttributes, TModelAttributes>): Function;

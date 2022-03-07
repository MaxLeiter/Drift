import { ScopeTableOptions } from './scope-table-options';
import { ScopeFindOptions } from './scope-find-options';
import { FindOptions } from 'sequelize';
export interface ScopeOptions<TCreationAttributes, TModelAttributes> extends ScopeTableOptions<TCreationAttributes, TModelAttributes> {
    defaultScope?: ScopeFindOptions<TCreationAttributes, TModelAttributes>;
}
export interface ScopeOptionsGetters {
    getDefaultScope?: DefaultScopeGetter;
    getScopes?: ScopesOptionsGetter;
}
export declare type DefaultScopeGetter = () => FindOptions;
export declare type ScopesOptionsGetter = () => {
    [sopeName: string]: ScopesOptions;
};
export declare type ScopesOptions = FindOptions | ((...args: any[]) => FindOptions);

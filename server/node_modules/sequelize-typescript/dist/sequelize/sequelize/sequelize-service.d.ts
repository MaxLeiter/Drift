import { ModelMatch, SequelizeOptions } from './sequelize-options';
import { ModelCtor } from '../../model/model/model';
/**
 * Prepares sequelize config passed to original sequelize constructor
 */
export declare function prepareOptions(options: SequelizeOptions): SequelizeOptions;
export declare function prepareArgs(...args: any[]): {
    preparedArgs: any[];
    options?: SequelizeOptions;
};
/**
 * Determines models from value
 */
export declare function getModels(arg: (ModelCtor | string)[], modelMatch: ModelMatch): ModelCtor[];

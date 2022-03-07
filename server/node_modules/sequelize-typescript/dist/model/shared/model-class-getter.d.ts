import { ModelType } from '../model/model';
export declare type ModelClassGetter<TCreationAttributes, TModelAttributes> = (returns?: void) => ModelType<TCreationAttributes, TModelAttributes>;

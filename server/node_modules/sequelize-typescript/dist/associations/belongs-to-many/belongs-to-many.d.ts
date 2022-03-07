import { BelongsToManyOptions } from './belongs-to-many-options';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
export declare function BelongsToMany<TCreationAttributes, TModelAttributes, TCreationAttributesThrough, TModelAttributesThrough>(associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>, through: ModelClassGetter<TCreationAttributesThrough, TModelAttributesThrough> | string, foreignKey?: string, otherKey?: string): Function;
export declare function BelongsToMany<TCreationAttributes, TModelAttributes, TCreationAttributesThrough, TModelAttributesThrough>(associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>, options: BelongsToManyOptions<TCreationAttributesThrough, TModelAttributesThrough>): Function;

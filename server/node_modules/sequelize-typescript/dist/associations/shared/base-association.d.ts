import { UnionAssociationOptions } from './union-association-options';
import { Association } from './association';
import { ModelClassGetter } from '../../model/shared/model-class-getter';
import { ModelType } from '../../model/model/model';
import { Sequelize } from '../../sequelize/sequelize/sequelize';
export declare abstract class BaseAssociation<TCreationAttributes, TModelAttributes> {
    private associatedClassGetter;
    protected options: UnionAssociationOptions;
    constructor(associatedClassGetter: ModelClassGetter<TCreationAttributes, TModelAttributes>, options: UnionAssociationOptions);
    abstract getAssociation(): Association;
    abstract getSequelizeOptions(model: ModelType<TCreationAttributes, TModelAttributes>, sequelize: Sequelize): UnionAssociationOptions;
    getAssociatedClass(): ModelType<TCreationAttributes, TModelAttributes>;
    getAs(): string | {
        singular: string;
        plural: string;
    } | undefined;
}

import { FindOptions } from 'sequelize';
export declare type AssociationGetOptions = {
    scope?: string | boolean;
    schema?: string;
} & FindOptions;

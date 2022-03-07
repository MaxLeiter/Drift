import 'reflect-metadata';
import { IndexesOptions as SequelizeIndexOptions } from 'sequelize';
export interface IndexFieldOptions {
    name: string;
    length?: number;
    order?: 'ASC' | 'DESC';
    collate?: string;
}
export interface IndexesMeta {
    named: {
        [name: string]: IndexOptions;
    };
    unnamed: IndexOptions[];
}
export declare type IndexOptions = Pick<SequelizeIndexOptions, Exclude<keyof SequelizeIndexOptions, 'fields'>>;
/**
 * Returns model indexes from class by restoring this
 * information from reflect metadata
 */
export declare function getIndexes(target: any): IndexesMeta;
/**
 * Sets indexes
 */
export declare function setIndexes(target: any, indexes: IndexesMeta): void;
/**
 * Adds field to index by sequelize index and index field options,
 * and stores this information through reflect metadata. Returns index ID.
 */
export declare function addFieldToIndex(target: any, fieldOptions: IndexFieldOptions, indexOptions: IndexOptions, indexId?: string | number): string | number;

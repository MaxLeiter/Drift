import { DataType, DataTypeAbstract } from 'sequelize';
export declare function isDataType(value: any): value is DataType;
/**
 * Infers sequelize data type by design type
 */
export declare function inferDataType(designType: any): DataTypeAbstract | undefined;

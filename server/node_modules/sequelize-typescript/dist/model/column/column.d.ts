import { ModelAttributeColumnOptions, DataType } from 'sequelize';
export declare function Column(dataType: DataType): Function;
export declare function Column(options: Partial<ModelAttributeColumnOptions>): Function;
export declare function Column(target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor): void;

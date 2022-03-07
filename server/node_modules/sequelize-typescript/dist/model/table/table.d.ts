import { TableOptions } from './table-options';
import { Model } from '../model/model';
export declare function Table<M extends Model = Model>(options: TableOptions<M>): Function;
export declare function Table(target: Function): void;

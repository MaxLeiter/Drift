import { NonAbstract } from '../../shared/types';
import { Model } from '../..';
export declare type Repository<M> = (new () => M) & NonAbstract<typeof Model>;

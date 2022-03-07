import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  database: 'movies',
  storage: ':memory:',
  models: [__dirname + '/models']
});

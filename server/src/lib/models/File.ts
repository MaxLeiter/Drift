import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { Post } from './Post';
import { User } from './User';


@Scopes(() => ({
  full: {
    include: [{
      model: User,
      through: { attributes: [] },
    },
    {
      model: Post,
      through: { attributes: [] },
    }]
  }
}))

@Table
export class File extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column
  title!: string;

  @Column
  content!: string;

  @Column
  sha!: string;

  @Column
  html!: string;

  @ForeignKey(() => User)
  @BelongsTo(() => User, 'userId')
  user!: User;

  @ForeignKey(() => Post)
  @BelongsTo(() => Post, 'postId')
  post!: Post;

  @CreatedAt
  @Column
  createdAt!: Date;
}

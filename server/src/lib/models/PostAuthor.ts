import { Model, Column, Table, ForeignKey, IsUUID, PrimaryKey, DataType } from "sequelize-typescript";
import { Post } from "./Post";
import { User } from "./User";

@Table
export class PostAuthor extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ForeignKey(() => Post)
  @Column
  postId!: number;

  @ForeignKey(() => User)
  @Column
  authorId!: number;
}

import {
	Model,
	Column,
	Table,
	ForeignKey,
	IsUUID,
	PrimaryKey,
	DataType,
	Unique
} from "sequelize-typescript"
import { Post } from "./Post"
import { User } from "./User"

@Table({
	tableName: "post_authors"
})
export class PostAuthor extends Model {
	@IsUUID(4)
	@PrimaryKey
	@Unique
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id!: string

	@ForeignKey(() => Post)
	@Column
	postId!: number

	@ForeignKey(() => User)
	@Column
	userId!: number
}

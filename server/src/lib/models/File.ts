import {
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	IsUUID,
	Model,
	PrimaryKey,
	Scopes,
	Table,
	Unique
} from "sequelize-typescript"
import { Post } from "./Post"
import { User } from "./User"

@Scopes(() => ({
	full: {
		include: [
			{
				model: User,
				through: { attributes: [] }
			},
			{
				model: Post,
				through: { attributes: [] }
			}
		]
	}
}))
@Table({
	tableName: "files"
})
export class File extends Model {
	@IsUUID(4)
	@PrimaryKey
	@Unique
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id!: string

	@Column
	title!: string

	@Column
	content!: string

	@Column
	sha!: string

	@Column
	html!: string

	@BelongsTo(() => User, "userId")
	user!: User

	@BelongsTo(() => Post, "postId")
	post!: Post

	@ForeignKey(() => User)
	@Column
	userId!: number

	@ForeignKey(() => Post)
	@Column
	postId!: number

	@CreatedAt
	@Column
	createdAt!: Date
}

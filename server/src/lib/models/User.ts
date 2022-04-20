import {
	Model,
	Column,
	Table,
	BelongsToMany,
	Scopes,
	CreatedAt,
	UpdatedAt,
	IsUUID,
	PrimaryKey,
	DataType,
	Unique
} from "sequelize-typescript"
import { Post } from "./Post"
import { PostAuthor } from "./PostAuthor"

@Scopes(() => ({
	posts: {
		include: [
			{
				model: Post,
				through: { attributes: [] }
			}
		]
	},
	withoutPassword: {
		attributes: {
			exclude: ["password"]
		}
	}
}))
@Table({
	tableName: "users"
})
export class User extends Model {
	@IsUUID(4)
	@PrimaryKey
	@Unique
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id!: string

	@Column
	username!: string

	@Column
	password!: string

	@BelongsToMany(() => Post, () => PostAuthor)
	posts?: Post[]

	@CreatedAt
	@Column
	createdAt!: Date

	@UpdatedAt
	@Column
	updatedAt!: Date

	@Column
	role!: string

	@Column
	email?: string

	@Column
	displayName?: string

	@Column
	bio?: string
}

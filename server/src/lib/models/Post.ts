import {
	BelongsToMany,
	Column,
	CreatedAt,
	DataType,
	HasMany,
	IsUUID,
	Model,
	PrimaryKey,
	Scopes,
	Table,
	Unique,
	UpdatedAt
} from "sequelize-typescript"
import { PostAuthor } from "./PostAuthor"
import { User } from "./User"
import { File } from "./File"

@Scopes(() => ({
	user: {
		include: [
			{
				model: User,
				through: { attributes: [] }
			}
		]
	},
	full: {
		include: [
			{
				model: User,
				through: { attributes: [] }
			},
			{
				model: File,
				through: { attributes: [] }
			}
		]
	}
}))
@Table({
	tableName: "posts"
})
export class Post extends Model {
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

	@BelongsToMany(() => User, () => PostAuthor)
	users?: User[]

	@HasMany(() => File, { constraints: false })
	files?: File[]

	@CreatedAt
	@Column
	createdAt!: Date

	@Column
	visibility!: string

	@Column
	password?: string

	@UpdatedAt
	@Column
	updatedAt!: Date
}

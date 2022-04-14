import {
	BelongsToMany,
	Column,
	CreatedAt,
	DataType,
	HasMany,
	HasOne,
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

	@Column
	description?: string

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

	@Column
	deletedAt?: Date

	@Column
	expiresAt?: Date

	@HasOne(() => Post, { foreignKey: "parentId", constraints: false })
	parent?: Post

	// TODO: deletedBy
}

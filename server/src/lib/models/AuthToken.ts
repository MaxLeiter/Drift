import {
	Model,
	Column,
	Table,
	IsUUID,
	PrimaryKey,
	DataType,
	CreatedAt,
	UpdatedAt,
	DeletedAt,
	Unique,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript"
import { User } from "./User"

@Table
export class AuthToken extends Model {
	@IsUUID(4)
	@PrimaryKey
	@Unique
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id!: string

	@Column
	token!: string

	@BelongsTo(() => User, "userId")
	user!: User

	@ForeignKey(() => User)
	@Column
	userId!: number

	@Column
	expiredReason?: string

	@CreatedAt
	@Column
	createdAt!: Date

	@UpdatedAt
	@Column
	updatedAt!: Date

	@DeletedAt
	@Column
	deletedAt?: Date
}

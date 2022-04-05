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
	Unique
} from "sequelize-typescript"

@Table
export class JWTDenyList extends Model {
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

	@Column
	reason!: string

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

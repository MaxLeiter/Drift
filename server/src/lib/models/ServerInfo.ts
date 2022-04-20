import {
	Model,
	Column,
	Table,
	IsUUID,
	PrimaryKey,
	DataType,
	Unique
} from "sequelize-typescript"

@Table({
	tableName: "server-info"
})
export class ServerInfo extends Model {
	@IsUUID(4)
	@PrimaryKey
	@Unique
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id!: string

	@Column({
		type: DataType.STRING
	})
	welcomeMessage!: string

	@Column({
		type: DataType.STRING
	})
	welcomeTitle!: string
}

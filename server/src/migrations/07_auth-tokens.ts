"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.createTable("AuthTokens", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true
		},
		token: {
			type: DataTypes.STRING
		},
		expiredReason: {
			type: DataTypes.STRING,
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
		}
	})

export const down: Migration = async ({ context: queryInterface }) =>
	queryInterface.dropTable("AuthTokens")

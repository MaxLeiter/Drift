"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.createTable("JWTDenyLists", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true
		},
		token: {
			type: DataTypes.STRING
		},
		reason: {
			type: DataTypes.STRING
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		},
		deletedAt: {
			type: DataTypes.DATE
		}
	})

export const down: Migration = async ({ context: queryInterface }) =>
	queryInterface.dropTable("JWTDenyLists")

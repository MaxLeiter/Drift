"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.createTable("posts", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true
		},
		title: {
			type: DataTypes.STRING
		},
		visibility: {
			type: DataTypes.STRING
		},
		password: {
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
	await queryInterface.dropTable("posts")

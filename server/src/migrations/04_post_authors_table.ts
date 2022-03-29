"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.createTable("post_authors", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		},
		postId: {
			type: DataTypes.UUID,
			primaryKey: true,
			references: {
				model: "posts",
				key: "id"
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		},
		userId: {
			type: DataTypes.UUID,
			primaryKey: true,
			references: {
				model: "users",
				key: "id"
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}
	})

export const down: Migration = async ({ context: queryInterface }) =>
	await queryInterface.dropTable("post_authors")

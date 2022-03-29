"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.createTable("files", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		title: {
			type: DataTypes.STRING
		},
		content: {
			type: DataTypes.STRING
		},
		sha: {
			type: DataTypes.STRING
		},
		html: {
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
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			},
			onDelete: "SET NULL",
			onUpdate: "CASCADE"
		},
		postId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "posts",
				key: "id"
			},
			onDelete: "SET NULL",
			onUpdate: "CASCADE"
		}
	})

export const down: Migration = async ({ context: queryInterface }) =>
	await queryInterface.dropTable("files")

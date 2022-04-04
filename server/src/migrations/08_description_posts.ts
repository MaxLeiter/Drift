"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.addColumn("posts", "description", {
		type: DataTypes.STRING,
		allowNull: true
	})

export const down: Migration = async ({ context: queryInterface }) =>
	await queryInterface.removeColumn("posts", "description")

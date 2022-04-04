"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.addColumn("posts", "expiresAt", {
		type: DataTypes.DATE,
		allowNull: true
	})

export const down: Migration = async ({ context: queryInterface }) =>
	await queryInterface.removeColumn("posts", "expiresAt")

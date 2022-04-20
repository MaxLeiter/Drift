"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	Promise.all([
		queryInterface.addColumn("users", "email", {
			type: DataTypes.STRING,
			allowNull: true
		}),
		queryInterface.addColumn("users", "displayName", {
			type: DataTypes.STRING,
			allowNull: true
		}),
		queryInterface.addColumn("users", "bio", {
			type: DataTypes.STRING,
			allowNull: true
		})
	])

export const down: Migration = async ({ context: queryInterface }) =>
	Promise.all([
		queryInterface.removeColumn("users", "email"),
		queryInterface.removeColumn("users", "displayName"),
		queryInterface.removeColumn("users", "bio")
	])

"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
	queryInterface.createTable("server-info", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			defaultValue: 1
		},
		welcomeMessage: {
			type: DataTypes.TEXT,
			defaultValue:
				"## Drift is a self-hostable clone of GitHub Gist. \nIt is a simple way to share code and text snippets with your friends, with support for the following:\n  \n  - Render GitHub Extended Markdown (including images)\n  - User authentication\n  - Private, public, and password protected posts\n  - Markdown is rendered and stored on the server\n  - Syntax highlighting and automatic language detection\n  - Drag-and-drop file uploading\n\n  If you want to signup, you can join at [/signup](/signup) as long as you have a passcode provided by the administrator (which you don't need for this demo). **This demo is on a memory-only database, so accounts and pastes can be deleted at any time.** \n\nYou can find the source code on [GitHub](https://github.com/MaxLeiter/drift).",
			allowNull: true
		},
		welcomeTitle: {
			type: DataTypes.TEXT,
			defaultValue: "Welcome to Drift",
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: true
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: true
		}
	})

export const down: Migration = async ({ context: queryInterface }) =>
	queryInterface.dropTable("server-info")

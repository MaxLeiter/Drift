"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
    queryInterface.addColumn("users", "role", {
        type: DataTypes.STRING,
        defaultValue: "user"
    })

export const down: Migration = async ({ context: queryInterface }) =>
    queryInterface.removeColumn("users", "role")

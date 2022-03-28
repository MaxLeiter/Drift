"use strict"
import { DataTypes } from "sequelize"
import type { Migration } from "../database"

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.createTable("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  })

export const down: Migration = async ({ context: queryInterface }) =>
  queryInterface.dropTable("users")

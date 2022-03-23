const { DataTypes } = require("sequelize");

async function up(qi) {
  try {
    await qi.addColumn("Posts", "html", {
      allowNull: true,
      type: DataTypes.STRING,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function down(qi) {
  try {
    await qi.removeColumn("Posts", "html");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = {
  up,
  down,
};

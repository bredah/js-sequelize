/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mensagens", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUID,
      },
      usuario: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
      },
      conteudo: {
        type: Sequelize.DataTypes.STRING(150),
        allowNull: false,
      },
      gostei: { 
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
       },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mensagens");
  },
};

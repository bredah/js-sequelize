const dataPadrao = new Date('2024-06-15T12:30:55Z');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("mensagens", [
      {
        id: "d2160977-bdba-4c4e-9167-c90f9fd1baa7",
        usuario: "usuario_01",
        conteudo: "mensagem 01",
        gostei: 0,
        created_at: dataPadrao,
        updated_at: dataPadrao,
      },
      {
        id: "877f7b52-59ed-4900-b5c8-b072f5f6cb6f",
        usuario: "usuario_02",
        conteudo: "mensagem 02",
        gostei: 0,
        created_at: dataPadrao,
        updated_at: dataPadrao,
      },
      {
        id: "1f10b77a-6640-49cc-9ff1-cac05a1da83f",
        usuario: "usuario_03",
        conteudo: "mensagem 03",
        gostei: 0,
        created_at: dataPadrao,
        updated_at: dataPadrao,
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("mensagens", null, {});
  },
};

import sequelize from "../../../src/config/databaseFactory";
import { mockConfig } from "../mock/databaseMock";
import { Sequelize } from "sequelize";

process.env.MY_ENV_VARIABLE = "test";

describe("config: databaseFactory", () => {
  let spySequelizeAuthenticate;
  let spySequelizeClose;

  beforeEach(() => {
    spySequelizeAuthenticate = jest
      .spyOn(Sequelize.prototype, "authenticate")
      .mockResolvedValue();
    spySequelizeClose = jest
      .spyOn(Sequelize.prototype, "close")
      .mockResolvedValue();
  });

  afterEach(async () => {
    await databaseFactory.disconnect();
    jest.restoreAllMocks(); // Restaura os mocks ao estado original
  });

  test("deve permitir iniciar a conexão com a base de dados", async () => {
    const sequelizeInstance = await databaseFactory.connect(mockConfig);
    const isConnected = await databaseFactory.isConnected();

    expect(sequelizeInstance).toBeTruthy();
    expect(isConnected).toBe(true);
    expect(spySequelizeAuthenticate).toHaveBeenCalledTimes(2);
  });

  test("deve permitir fechar a conexão com a base de dados", async () => {
    await databaseFactory.connect(mockConfig);
    await databaseFactory.disconnect();
    const isConnected = await databaseFactory.isConnected();

    expect(isConnected).toBe(false);
    expect(spySequelizeAuthenticate).toHaveBeenCalledTimes(1);
    expect(spySequelizeClose).toHaveBeenCalledTimes(1);
  });

  test("deve reutilizar a mesma instância de Sequelize em chamadas simultâneas ao connect", async () => {
    const [sequelizeInstance1, sequelizeInstance2] = await Promise.all([
      databaseFactory.connect(mockConfig),
      databaseFactory.connect(mockConfig),
    ]);

    expect(sequelizeInstance1).toBe(sequelizeInstance2); // Ambas as instâncias devem ser iguais
    expect(spySequelizeAuthenticate).toHaveBeenCalledTimes(1); // Autenticação deve ser chamada apenas uma vez
  });

  test("deve garantir que apenas uma instância de DataBaseFactory seja criada", () => {
    const instance1 = databaseFactory;
    const instance2 = databaseFactory;

    expect(instance1).toBe(instance2); // Ambas as instâncias devem ser iguais
  });

  test("deve retornar false se ocorrer uma exceção ao validar a conexão via isConnected", async () => {
    spySequelizeAuthenticate
      .mockImplementationOnce(() => Promise.resolve())
      .mockImplementationOnce(() => {
        throw new Error("Erro ao autenticar");
      });

    await databaseFactory.connect(mockConfig);

    const isConnected = await databaseFactory.isConnected();

    expect(isConnected).toBe(false);
    expect(spySequelizeAuthenticate).toHaveBeenCalledTimes(2);
  });
});

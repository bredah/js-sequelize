import { Given, Then, When } from "@cucumber/cucumber";
import request from "supertest";
import app from "../../../src/server";
import assert from "assert";

let response;
let requestBody;

Given("que eu tenha uma mensagem válida", () => {
  requestBody = {
    usuario: "usuario_01",
    conteudo: "Esta é uma mensagem válida",
  };
});

Given("que eu não tenha uma mensagem no corpo da requisição", () => {
  requestBody = {};
});

Given("que eu tenha uma mensagem sem o campo usuário", () => {
  requestBody = {
    conteudo: "Esta é uma mensagem válida",
  };
});

When("eu enviar a requisição de cadastro de mensagem", async () => {
  response = await request(app).post("/mensagens").send(requestBody);
  console.log("Resposta:", response.body); // Log para depuração
});

Then("a mensagem deve ser registrada com sucesso", () => {
  assert.equal(response.status, 201);
});

Then("a mensagem não é cadastrada", () => {
  assert.equal(response.status, 500);
});

Then(
  "deve apresentar o erro indicando que o campo 'usuário' é obrigatório",
  () => {
    assert.ok(response.body.error.includes("o campo 'usuario' é obrigatório"));
  }
);

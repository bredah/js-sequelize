# language: pt
Funcionalidade: Cadastro de Mensagem
Como usuário da API
Eu quero cadastrar uma mensagem
Para que ela seja armazenada e possa ser recuperada posteriormente

  Cenário: Cadastro de mensagem com sucesso
    Dado que eu tenha uma mensagem válida
    Quando eu enviar a requisição de cadastro de mensagem
    Então a mensagem deve ser registrada com sucesso

  Cenário: Cadastro de mensagem sem corpo
    Dado que eu tenha uma mensagem sem o campo usuário
    Quando eu enviar a requisição de cadastro de mensagem
    Então a mensagem não é cadastrada
    E deve apresentar o erro indicando que o campo 'usuário' é obrigatório

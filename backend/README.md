# Teste Técnico - Backend

> Knex Empresa Júnior de Computação

## Descrição

API REST em NodeJS para geranciar as doações para os doguinhos que moram no campus 7 da UEPB, em Patos. Possuindo meios para gerenciar o historico de transações dos Doadores, as suas Doações e os Pagamentos realizados pelos mesmos.

## Conteudos

- [Requisitos](#requisitos)
- [Passos Iniciais](#passos-iniciais)
- [Comandos Node](#comandos-node)

- ### [Rotas](#rotas)

  - [Doador](#doador)
  - [Doação](#doação)
  - [Pagamentos](#pagamentos)

- [Tecnologias](#tecnologias)
- ***

## Requisitos

- [NodeJS](https://nodejs.org)
- [Docker](https://docker.com)
- [Postgres](https://postgresql.org) caso não queira usar o docker

---

## Passos iniciais

```bash

# Clone o repositório do projeto

# Entre na pasta clonada

# Utilize o gerenciador de pacotes de sua preferencia para instalar as dependências (neste projeto foi utilizado o pnpm)
pnpm i

# Construa a imagem
docker-compose build

# Inicie o container em segundo plano
docker-compose up -d

# Popule o banco de dados
pnpm prisma migrate dev

# Inicie o projeto em modo de desenvolvimento
pnpm run dev

# O servidor iniciara normalmente na porta 3000 (caso nenhuma outra tenha sido configurada no .env)

# As requisições são feitas na url http://localhost:3000

```

---

## Comandos Node

```bash

# Iniciar o servidor de testes
pnpm run dev

# Iniciar o servidor
pnpm run start

# Buildar o projeto
pnpm run build

```

---

## Rotas

### Doador

---

### Criação de Doador - POST

`http://localhost:3000/doador/`

Body

| Parametro | Tipo     | Descrição          |
| --------- | -------- | ------------------ |
| nome      | `string` | Nome do Doador     |
| email     | `string` | Email do Doador    |
| telefone  | `string` | Telefone do Doador |

Correct Response - 201

```json
{
  "id": "uuid_doador",
  "nome": "nome_doador",
  "email": "email_doador",
  "telefone": "telefone_doador",
  "data_cadastro": "data_cadastro_doador",
  "updated_at": "data_update_doador"
}
```

### Buscar os Doadores cadastrados - GET

`http://localhost:3000/doador/`

Correct Response - 200

```json
[
  {
    "id": "uuid_doador",
    "nome": "nome_doador",
    "email": "email_doador",
    "telefone": "telefone_doador",
    "data_cadastro": "data_cadastro_doador",
    "updated_at": "data_update_doador"
  },
  ...
]
```

### Buscar Doador especifico - GET

`http://localhost:3000/doador/:doadorId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doadorId\* | `string` | UUID do Doador |

Correct Response - 200

```json
[
  {
    "id": "uuid_doador",
    "nome": "nome_doador",
    "email": "email_doador",
    "telefone": "telefone_doador",
    "data_cadastro": "data_cadastro_doador",
    "updated_at": "data_update_doador"
  }
]
```

### Modificar Doador - PATCH

`http://localhost:3000/doador/:doadorId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doadorId\* | `string` | UUID do Doador |

Body

| Parametro | Tipo     | Descrição          |
| --------- | -------- | ------------------ |
| nome?     | `string` | Nome do Doador     |
| email?    | `string` | Email do Doador    |
| telefone? | `string` | Telefone do Doador |

Correct Response - 200

```json
[
  {
    "id": "uuid_doador",
    "nome": "nome_doador",
    "email": "email_doador",
    "telefone": "telefone_doador",
    "data_cadastro": "data_cadastro_doador",
    "updated_at": "data_update_doador"
  }
]
```

### Deletar Doador - DELETE

`http://localhost:3000/doador/:doadorId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doadorId\* | `string` | UUID do Doador |

Correct Response - 200

```json
{
  "message": "Doador deletado com sucesso!",
  "doador": {
    "id": "uuid_doador",
    "nome": "nome_doador",
    "email": "email_doador",
    "telefone": "telefone_doador",
    "data_cadastro": "data_cadastro_doador",
    "updated_at": "data_update_doador"
  }
}
```

### Buscar doações do Doador - GET

`http://localhost:3000/doador/:doadorId/doacoes`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doadorId\* | `string` | UUID do Doador |

Correct Response - 200

```json
{
  "Doacao": [
    {
      "id": "uuid_doador",
      "nome": "nome_doador",
      "email": "email_doador",
      "telefone": "telefone_doador",
      "data_cadastro": "data_cadastro_doador",
      "updated_at": "data_update_doador"
    }
  ]
}
```

---

### Doação

---

### Fazer Doação - POST

`http://localhost:3000/doacao/`

Body

| Parametro  | Tipo     | Descrição          |
| ---------- | -------- | ------------------ |
| valor\*    | `number` | Valor da Doação    |
| mensagem?  | `string` | Mensagem da Doação |
| doadorId\* | `string` | UUID do doador     |

Correct Response - 201

```json
{
  "doacao": {
    "id": "uuid_doacao",
    "valor": "valor_doacao",
    "mensagem": "mensagem_doacao",
    "status": "status_doacao",
    "data_criacao": "data_criacao",
    "data_confirmacao": "data_confirmacao",
    "updated_at": "data_update",
    "doadorId": "uuid_doador"
  },
  "pagamento": {
    "qr_code": {
      "qr_code": "chave_unica_pagamento",
      "qr_code_base64": "qr_code_base64"
    }
  }
}
```

### Buscar os Doações cadastrados - GET

`http://localhost:3000/doacao/`

Parametros GET

| Nome     | Tipo     | Descrição                                                                                |
| -------- | -------- | ---------------------------------------------------------------------------------------- |
| filter?  | `string` | Opção de filtro, podendo ser por período ou valor                                        |
| orderBy? | `string` | Opção de ordenação, podendo ser por valor, status, data de criação e data de confirmação |
| start?   | `string` | Valor de inicio da filtragem                                                             |
| end?     | `string` | Valor limite da filtragem                                                                |
| status?  | `string` | Caso queira filtrar por status também                                                    |

Correct Response - 200

```json
[
  {
    "id": "uuid_doacao",
    "valor": "valor_doacao",
    "mensagem": "mensagem_doacao",
    "status": "status_doacao",
    "data_criacao": "data_criacao_doacao",
    "data_confirmacao": "data_confirmacao",
    "updated_at": "last_update_data",
    "doadorId": "uuid_do_responsavel_pela_doacao"
  },
  ...
]
```

### Buscar Doação especifico - GET

`http://localhost:3000/doador/:doadorId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doadorId\* | `string` | UUID do Doador |

Correct Response - 200

```json
{
  "id": "uuid_doacao",
  "valor": "valor_doacao",
  "mensagem": "mensagem_doacao",
  "status": "status_doacao",
  "data_criacao": "data_criacao",
  "data_confirmacao": "data_confirmacao",
  "updated_at": "last_update_data",
  "doadorId": "uuid_responsavel_pela_doacao"
}
```

### Modificar Doador - PUT

`http://localhost:3000/doador/:doadorId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doadorId\* | `string` | UUID do Doador |

Body

| Parametro | Tipo     | Descrição          |
| --------- | -------- | ------------------ |
| valor?    | `number` | Valor da Doação    |
| mensagem? | `string` | Mensagem da Doação |
| doadorId? | `string` | UUID do doador     |

Correct Response - 200

```json
[
  {
    "id": "uuid_doador",
    "nome": "nome_doador",
    "email": "email_doador",
    "telefone": "telefone_doador",
    "data_cadastro": "data_cadastro_doador",
    "updated_at": "data_update_doador"
  }
]
```

### Deletar Doação - DELETE

`http://localhost:3000/doacao/:doacaoId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doacaoId\* | `string` | UUID da Doacao |

Correct Response - 200

```json
{
  "message": "Pagamento da doacao deletado com sucesso",
  "code": "codigo_retorno"
}
```

### Confirmar Pagamento da Doação - POST

Essa também é a rota usada pela API de pagamentos para notificar a mudança de status no pagamento

`http://localhost:3000/doador/realizar-pagamento/:doacaoId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doacaoId\* | `string` | UUID da Doação |

Body

| Parametro | Tipo     | Descrição                                           |
| --------- | -------- | --------------------------------------------------- |
| action\*  | `string` | Ação a ser realizada, normalmente `payment.updated` |

Correct Response - 200

```json
{
  "message": "Pagamento da doação realizada!",
  "code": "OK"
}
```

### Cancelar Doação - PUT

`http://localhost:3000/doador/cancelar/:doacaoId`

Parâmetros

| Nome       | Tipo     | Descrição      |
| ---------- | -------- | -------------- |
| doacaoId\* | `string` | UUID da Doação |

Correct Response - 200

```json
{
  "message": "Pagamento Cancelado com sucesso!",
  "code": "OK"
}
```

---

## Pagamentos

---

### Buscar Pagamentos - GET

`http://localhost:3000/pagamento`

Parametros GET

| Nome     | Tipo     | Descrição                                                                                            |
| -------- | -------- | ---------------------------------------------------------------------------------------------------- |
| filter?  | `string` | Opção de filtro, podendo ser por data de criação, data de expiração ou data de confirmação           |
| orderBy? | `string` | Opção de ordenação, podendo ser por status, data de criação, data de confirmação e data de expiração |
| start?   | `string` | Valor de inicio da filtragem                                                                         |
| end?     | `string` | Valor limite da filtragem                                                                            |
| status?  | `string` | Caso queira filtrar por status também                                                                |

Correct Response - 200

```json
[
    {
        "id": "uuid_pagamento",
        "paymentId": "id_pagamento_mercado_pago",
        "chave_pix": "pix_chave_unica",
        "qr_code": "qr_code_base64",
        "status": "status_pagamento",
        "data_criacao": "data_criacao",
        "data_expiracao": "data_expiracao",
        "data_confirmacao": "data_confirmacao",
        "updated_at": "last_update_pagamento",
        "doacaoId": "doacao_uuid"
    },
    ...
]
```

### Buscar Pagamento - GET

`http://localhost:3000/pagamento/:pagamentoId`

Parâmetros

| Nome          | Tipo     | Descrição         |
| ------------- | -------- | ----------------- |
| pagamentoId\* | `string` | UUID do Pagamento |

Correct Response - 200

```json
{
  "id": "uuid_pagamento",
  "paymentId": "id_pagamento_mercado_pago",
  "chave_pix": "pix_chave_unica",
  "qr_code": "qr_code_base64",
  "status": "status_pagamento",
  "data_criacao": "data_criacao",
  "data_expiracao": "data_expiracao",
  "data_confirmacao": "data_confirmacao",
  "updated_at": "last_update_pagamento",
  "doacaoId": "doacao_uuid"
}
```

### Buscar Status do Pagamento - GET

`http://localhost:3000/pagamento/status/:pagamentoId`

Parâmetros

| Nome          | Tipo     | Descrição         |
| ------------- | -------- | ----------------- |
| pagamentoId\* | `string` | UUID do Pagamento |

Correct Response - 200

```json
{
  "status": "status_pagamento"
}
```

### Buscar QRCode do Pagamento - GET

`http://localhost:3000/pagamento/qr-code/:pagamentoId`

Parâmetros

| Nome          | Tipo     | Descrição         |
| ------------- | -------- | ----------------- |
| pagamentoId\* | `string` | UUID do Pagamento |

Correct Response - 200

```json
{
  "qr_code": "pix_chave_unica",
  "qr_code_base64": "qr_code_base64"
}
```

### Renovar o Pagamento Expirado - POST

`http://localhost:3000/pagamento/regenerate/:pagamentoId`

Parâmetros

| Nome          | Tipo     | Descrição         |
| ------------- | -------- | ----------------- |
| pagamentoId\* | `string` | UUID do Pagamento |

Correct Response - 200

```json
{
  "qr_code": "pix_chave_unica",
  "qr_code_base64": "qr_code_base64"
}
```

---

## Tecnologias

No servidor foram utilizadas as seguintes tecnologias:

- [Express](https://expressjs.com)
- [Prisma](https://prisma.io)
- [Zod](https://zod.dev)
- [tsx](https://github.com/privatenumber/tsx)
- [tsup](https://github.com/egoist/tsup)
- [dotENV](https://github.com/motdotla/dotenv)
- [MercadoPagoSDK](https://github.com/mercadopago/sdk-nodejs) para Node
- [date-fns](https://github.com/date-fns/date-fns)

## Ideias a implementar

Como o projeto está em desenvolvimento, a implementação de alguns recursos ficaram faltando, como a possibilidade de registrar Doações continuas e automáticas.

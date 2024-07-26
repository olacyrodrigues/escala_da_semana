# Escala da da semana

Visto que estava tendo erros do jeito que era repassado entre os setores a escala da semana junto da minha equipe resolvemos fazer esse projeto pequeno para poder agilizar um pouco essa operação e minimizar os erros enviados nas escalas de quem trabalhará no final de semana.

## Screenshots

![App Screenshot](https://github.com/user-attachments/assets/9dc17124-4d4d-4b16-b3fb-a90de284cb6b)

## Funcionalidades

- Temas dark e light
- Preview em tempo real
- CRUD de dados / usuários

## Usado por

Esse projeto é usado pelas seguintes empresas:

- Barcelos

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/olacyrodrigues/escala_da_semana
```

Entre no diretório do projeto

```bash
  cd escala_da_semana
```

Entre no diretório do backend

```bash
  cd backend
```

Inicie o servidor

```bash
  node app.js
```

Acesse

```bash
  http://localhost:3000/index
```

## Documentação da API

#### registrar usuários

```bash
  POST / http://localhost:3000/api/users/create
```

#### alterar usuários

```bash
  PUT / http://localhost:3000/api/users/update
```

#### deletar usuários

```bash
  DELETE / http://localhost:3000/api/users/delete
```

#### mostrar todos usuários registrados

```bash
  GET http://localhost:3000/api/users/all
```

## Melhorias

estou perto de finalizar a "V1" do projeto, em breve irei fazer algumas melhorias e a primeira em mente é transformar o index.html em um e-mail gerado automaticamente para todos da empresa informando as escalas do final de semana vigente.

## Autores

- [@olacyrodrigues](https://github.com/olacyrodrigues)
- [@lucaswotta](https://github.com/lucaswotta)

# Shortener

## Documentação

 - Documentação em swagger
 - A documentação é gerada pela propria aplicação e está presente na rota `/documentation` ou `http://localhost:3000/documentation` [Doc](http://localhost:3000/documentation)



# Instalação do Backend:

## Pré-requisitos:

- Docker instalado no seu sistema operacional.

## Configuração do Ambiente:

1. Crie um arquivo `.env` no diretório raiz do projeto.
2. Utilize o arquivo `.env-example` como exemplo para preencher as variáveis de ambiente necessárias.

## Executando o Projeto pela Primeira Vez:

0. Inicie o Docker

1. Construa os contêineres utilizando o docker-compose:

   ```shell
   docker-compose up -d --build
   ```

2. Instale as dependencias:

   ```shell
   yarn install
   ```

3. Rode as migration que acompanha o projeto:

   ```shell
   typeorm migration:run
   ```

4. Start o projeto:

   ```shell
   yarn start
   ```

## Executando o Projeto a Partir da Segunda Vez:

0. Inicie o Docker

1. Inicie os contêineres com o docker-compose:

   ```shell
   docker-compose up -d --build
   ```

2. Inicie o projeto:
   ```shell
   yarn start
   ```

## Parando o Projeto:

1. ```shell
    docker-compose down
   ```
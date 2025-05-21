# Encurtador URL (shortener-url)

Projeto desenvolvido para teste técnico para vaga de Desenvolvedor Backend Pleno.

### Documentação da API.
   [https://documenter.getpostman.com/view/32027385/2s9YsFDtZ5](https://documenter.getpostman.com/view/36452934/2sB2qZEMzp) 

### Estrutura de pastas do projeto
Este projeto segue os princípios da Clean Architecture, visando separação de responsabilidades e independência entre as camadas. Abaixo está a estrutura de diretórios com suas respectivas finalidades:

```text
├── prisma/
│   └── migrations/
│       └── ...           # Migrations geradas pelo Prisma
│
└── src/
    ├── application/      # Camada de aplicação (use-cases)
    │   └── use-cases/
    │       ├── auth/             # Casos de uso relacionados à autenticação
    │       ├── contract/         # Contratos de entrada/saída dos use-cases
    │       ├── shortUrl/         # Casos de uso para encurtar, listar, deletar, redirecionar etc.
    │       └── user/             # Casos de uso relacionados a usuários
    │
    ├── domain/           # Camada de domínio (regras de negócio puras)
    │   ├── entities/            # Entidades de negócio
    │   ├── interfaces/          # Interfaces e contratos para repositórios e entidades
    │   └── objectValues/        # Value Objects utilizados pelas entidades
    │
    ├── infrastructure/   # Implementações concretas (banco, serviços externos, etc.)
    │   ├── factory/             # Fábricas para injeção de dependência
    │   ├── inMemory/            # Implementações em memória para testes/mocks
    │   └── prisma/              # Implementações usando o ORM Prisma
    │       ├── shortUrl/
    │       └── user/
    │
    ├── lib/              # Bibliotecas auxiliares compartilhadas
    │   └── tracing/             # Sistema de tracing/logging
    │
    ├── presentation/     # Camada de apresentação (HTTP)
    │   └── http/
    │       ├── controllers/     # Controllers que mapeiam as rotas para os use-cases
    │       └── routes/          # Definições das rotas HTTP agrupadas por contexto
    │
    ├── shared/           # Recursos e utilitários compartilhados por todo o projeto
    │   ├── errorHandler/        # Middleware de tratamento de erros
    │   ├── errors/              # Classes de erro customizadas
    │   ├── http/                # Utilitários relacionados à camada HTTP
    │   ├── plugins/             # Plugins globais (ex: validação, logging)
    │   ├── types/               # Tipagens globais do projeto
    │   └── utils/               # Funções utilitárias gerais
    │       ├── date/
    │       ├── request/
    │       └── zod/
    │
    └── tests/            # Testes automatizados
        ├── integration/         # Testes de integração
        │   ├── auth/
        │   ├── shortUrl/
        │   └── user/
        └── unit/                # Testes unitários
            ├── entities/
            ├── objectValues/
            └── repositories/
```
### Instruções.

Caso não tenha em sua maquina, baixe Docker Desktop:
   https://www.docker.com/products/docker-desktop/

Clone o repositório do projeto:
  ``` 
     git clone https://github.com/AndreLHPsilva/shortener-url.git
  ```
  ``` 
     cd shortener-url
  ```
Caso tenha o VSCODE em sua maquina:
   ``` 
     code .
   ```
Execute os seguintes comandos para configurar o projeto a primeira vez.
- Copie arquivo .ENV.EXEMPLE:
   -   BASH: 
    ```
      cp .\env.example .env
    ```
   -   PowerShell: 
    ```
      Copy-Item .\.env.example .env
    ```
- E depois:
    ```
     docker-compose up --build -d
    ```
- Aguarde alguns instantes e acesse a URL para visualizar o Swagger:
    [http://localhost:3000/docs](http://localhost:3000/docs)
  
- Você também poderá visualizar o tracing da aplicação no Jaeger:
    [http://localhost:](http://localhost:16686)

### Testes
   Para rodar os testes unitários e de integração, rode o comando
   ```
     npm run test
   ```  

### Testando a API
   - Você pode testar utilizando o POSTMAN, para isso, faça o download do mesmo: https://www.postman.com/downloads/ e instale em seu PC. Após o download e instalação, você pode importar a collection que está na raiz do projeto, nome: shortener_url_api.postman_collection.json ou acessar este link: [https://documenter.getpostman.com/view/32027385/2s9YsFDtZ5](https://documenter.getpostman.com/view/36452934/2sB2qZEMzp) onde se encontra a Documentação da API, com isso você conseguirá acessar a collection clicando em **RUN IN POSTMAN**

     ![image](https://github.com/user-attachments/assets/ae21ede5-eed9-423e-9a25-4051e2b0786d)

### Pontos de melhorias
    - Criação de um endpoint para listagem dos logs de atualizações da URL encurtada
    - Adicionar sistema de autorização para que ADMIN's possam visualizar URL's que não tenham usuários vinculados.
    - Melhorar a nomenclatura dos spans para melhor visualização
    - Adicionar exporter para métricas

### Sistema error codes
    -  Err0001 - Erros referente a validações das tipagens feitas no schema nos arquivos das rotas,
    -  Err0002 - Erros referente a validações do zod,
    -  Err0003 - Erro referente a geração do identificador único das URL's encurtadas,
    -  INTERNAL_ERROR - Erros internos que ocorreram inesperadamente,
    -  NOT_FOUND - Recurso ou item não encontrado,
    -  BAD_REQUEST - Indica que o servidor não pode ou não irá processar a requisição devido a alguma coisa que foi entendida como um erro do cliente,
    -  UNAUTHORIZED - Indica que o token JWT está ausente ou inválido e você não poderá prosseguir pois não está autorizado,
     
### Versão do NODE utilizada no desenvolvimento   
    v22.15.1
### Versão do NPM   
    v10.9.2
    
### Depêndencias
    Desenvolvimento: 
      "@types/node": "22.15.18",
      "prisma": "6.8.2",
      "tsup": "8.5.0",
      "tsx": "4.19.4",
      "typescript": "5.8.3",
      "vitest": "3.1.3"
    Produção
      "@fastify/cors": "11.0.1",
      "@fastify/jwt": "9.1.0",
      "@fastify/swagger": "9.5.1",
      "@fastify/swagger-ui": "5.2.2",
      "@opentelemetry/api": "1.9.0",
      "@opentelemetry/auto-instrumentations-node": "0.59.0",
      "@opentelemetry/exporter-metrics-otlp-grpc": "0.201.1",
      "@opentelemetry/exporter-trace-otlp-grpc": "0.201.1",
      "@opentelemetry/sdk-metrics": "2.0.1",
      "@opentelemetry/sdk-node": "0.201.1",
      "@prisma/client": "6.8.2",
      "@prisma/instrumentation": "^6.8.2",
      "bcryptjs": "3.0.2",
      "date-fns": "4.1.0",
      "date-fns-tz": "3.2.0",
      "dotenv": "16.5.0",
      "fastify": "5.3.3",
      "fastify-type-provider-zod": "4.0.2",
      "zod": "3.24.4"
     
### Diagrama de Entidade-Relacionamento
![prisma-erd](https://github.com/user-attachments/assets/3de4c4f5-3697-4da7-b44c-5f0064819368)

### Detalhes dos Requisitos para avaliação
Sobre o sistema:
O intuito é construir um sistema que encurte as URLs.
Informações de desenvolvimento:
Deverá ser implementado um projeto com NodeJS na última versão estável, sendo construído como API REST. Leve em consideração que o sistema será implementado em uma infraestrutura que escala verticalmente.
O sistema deve possibilitar o cadastro de usuários e autenticação dos mesmos.
O sistema deve possibilitar que a partir de um url enviado, ele seja encurtado para no máximo 6 caracteres. Exemplo:
Entrada: https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/
Saída: http://localhost/aZbKq7
Qualquer um pode solicitar que o URL seja encurtado e para encurtar deve existir apenas um endpoint, mas caso seja um usuário autenticado, o sistema deve registrar que o URL pertence ao usuário. 
Um usuário autenticado pode listar, editar o endereço de destino e excluir URLs encurtadas por ele.
Todo acesso a qualquer URL encurtado deve ser contabilizado no sistema.
Quando um usuário listar os urls deve aparecer na listagem a quantidade de cliques.
Todos os registros devem ter uma forma de saber quando foram atualizados.
Os registros só poderão ser deletados logicamente do banco, ou seja, deverá ter um campo que guarda a data de exclusão do registro, caso ela esteja nula é porque ele é válido, caso esteja preenchida é porque ele foi excluído e nenhuma operação de leitura ou escrita pode ser realizada por ele.

Sobre a entrega:
Construir uma estrutura de tabelas que faça sentido para o projeto usando um banco relacional.
Construir endpoints para autenticação de e-mail e senha que retorna um Bearer Token.
Construir apenas um endpoint para encurtar o URL, ele deve receber um URL de origem e deve aceitar requisições com e sem autenticação, deve retornar o url encurtado - incluindo o domínio..
Definir o que deve e não deve ser variável de ambiente..
Construir endpoints que aceitam apenas requisições autenticadas:
Listagem de URL Encurtados pelo usuário com contabilização de clicks
Deletar URL Encurtado
Atualizar a origem de um URL encurtado.
README ou CONTRIBUTING explicando como rodar o projeto.
Construir um endpoint que ao receber um URL encurtado, redirecione o usuário para o URL de origem e contabilize.
Maturidade 2 da API REST
Entrega com diferencial:
Utilizar docker-compose para subir o ambiente completo localmente.
Ter testes unitários
API está documentada com OPEN API ou Swagger
Ter validação de entrada em todos os lugares necessários.
Ter instrumentação de observabilidade (implementação real ou abstração) de um ou vários tipos:
Logs
Métricas
Rastreamento
Observação: Se a implementação for real, não é obrigatório que tenha no docker compose, ao rodarmos a aplicação podemos inserir as credenciais de serviços como Elastic, Sentry, Datadog, New Relic, Open Telemetry, Jagger, Prometheus e etc desde que esteja em variáveis de ambiente e uma explicação de como configurar. Também é interessante ter uma variável de ambiente que ativa ou desativa o uso da ferramenta.
Dar deploy no ambiente em um cloud provider e expor no readme o link.
Deixar no README pontos de melhoria para caso o sistema necessite escalar horizontalmente e quais serão os maiores desafios.

Monorepo com separação de serviços como gerenciamento de identidade e acesso e regra de negócio de encurtar URL com comunicação entre os serviços. Obrigatório docker-compose neste cenário.
Configurar um api gateway como KrankeD na frente dos serviços.
Utilizar changelog com a realidade do seu desenvolvimento
Git tags definindo versões de release, por exemplo release 0.1.0 como encurtador criado, 0.2.0 como autenticação, 0.3.0 como operações de usuário no encurtador, 0.4.0 como contabilização de acessos.
Construir deployments do Kubernetes para deploy.
Construir artefatos do Terraform para deploy.
Construir github actions para lint e testes automatizados.
Transformar o sistema em multi tenant.
Construir funcionalidades a mais que acredite ser interessante para o “domínio do negócio” da aplicação.
Definir e assegurar quais versões do NodeJS são aceitas no projeto.
Configurar pré commit ou pre push hooks.
Código tolerante a falhas.

O mesmo teste é utilizado para avaliação de todas as senioridades, então a maior partes dos diferenciais são voltados ao público mais sênior.
A avaliação é feita pela escrita do código, configurações da base de código, padrões de projetos, design patterns, boas práticas, commits, tags, arquitetura e tecnologias utilizadas. Levamos em consideração também quando o candidato recebe o teste e a data de entrega do teste. 
Caso o teste não rode no ambiente local do avaliador por falta de instruções, conflito de dependências que necessite “force” na instalação ou código quebrado, impactará negativamente a avaliação.
O código deve estar armazenado em um repositório público preferencialmente GitHub.
Desejamos boa sorte em seu processo!




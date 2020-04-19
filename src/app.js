const express = require("express");
const cors    = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // retorna todos os repositórios
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // cria novos repositórios
  const {title, url, techs} = request.body;

  // id gerado pelo uuid e vamos setar like inicialmente como 0
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  // adicionar repository para a lista de repositories
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // alterar um repositorio
  const {id}                  = request.params;
  const {title, url, techs}   = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'repository not found'});
  }

  // like não pode ser alterado manualmente, precisamos manter como vem da lista original
  const {likes} = repositories[repositoryIndex];

  // precisamos colocar as alterações no repositorio e acrescentar a lista de respositorios
  repository = {
    id,
    title,
    url,
    techs,
    likes
  }
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // deletar um repositório
  const {id} = request.params;

  // procurar o id dentro de repositorios
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // vamos chegar se o id retornou, se não existe vamos exibir um erro
  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'repository not found'});
  }

  // vamos "tirar" esse rep da lista de repositórios
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // vamos acrescer likes a um rep
  const {id} = request.params;

  // vamos procurar o rep dentro de repositorios
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'repository not found'});
  }

  let {title, url, techs, likes} = repositories[repositoryIndex];
  likes++;

  repository = {
    id,
    title,
    url,
    techs,
    likes
  }
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;

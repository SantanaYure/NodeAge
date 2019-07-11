const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true
});
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "njk");

/* Deve haver um middleware que é chamado nas rotas /major e /minor e checa se a
informação de idade não está presente nos Query Params. Se essa informação não existir deve
redirecionar o usuário para a página inicial com o formulário, caso contrário o middleware deve
apenas continuar com o fluxo normal. */
const checkAgeMiddleware = (req, res, next) => {
  const { age } = req.query;

  if (!age) {
    return res.redirect("/");
  }
  return next();
};

/* Rota inicial que renderiza uma página com um formulário com um único campo age
que representa a idade do usuário */
app.get("/", (req, res) => {
  return res.render("start");
});

/* Rota que renderiza uma página com o texto: Você é maior de idade e
possui x anos , onde x deve ser o valor informado no input do formulário; */
app.get("/major", checkAgeMiddleware, (req, res) => {
  const { age } = req.query;

  return res.render("major", { age });
});

/* Rota que renderiza uma página com o texto: Você é menor de idade e
possui x anos , onde x deve ser o valor informado no input do formulário; */
app.get("/minor", checkAgeMiddleware, (req, res) => {
  const { age } = req.query;

  return res.render("minor", { age });
});

/* Rota chamada pelo formulário da página inicial via método POST que checa se a
idade do usuário é maior que 18 e o redireciona para a rota /major , caso contrário o
redireciona para a rota /minor (Lembre de enviar a idade como Query Param no
redirecionamento); */
app.post("/check", (req, res) => {
  const { age } = req.body;

  if (age >= 18) {
    return res.redirect(`/major?age=${age}`);
  } else {
    return res.redirect(`minor?age=${age}`);
  }
});

app.listen(3000);

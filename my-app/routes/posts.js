const express = require('express');
const router =  express.Router();
const requireLogin = require('../middlewares/auth'); // Instancia a função de autenticação
const Post = require('../models/Post'); // Chama o modelo criado para os Posts

// Lista os posts do usuário logado
router.get('/', requireLogin, async function(req, res) {
  try {
    var posts = await Post.find({ author: req.session.userId }).sort({ createdAt: -1 }); // Salva os posts encontrados por um autor em uma variável e os coloca em ordem decrescente (mais novo ao mais antigo)
    console.log(posts); // Debug
    res.render('posts/index', { posts: posts , exclusiveCSS: 'posts'}); // Mostra na tela de posts as informações que foram guardadas na variável posts
  } catch (err) {
    console.error(err); // Envia um erro ao terminal
    res.send('Erro ao buscar posts: ' + err.message); // Mostra o erro no navegador
  }
});

// Mostra formulário de criar post
router.get('/new', requireLogin, function(req, res) {
  res.render('posts/new');
});

// Salva o novo post
router.post('/', requireLogin, async function(req, res) {
  try {
    var { title, content } = req.body; // Pega as informações do corpo da rota
    var newPost = new Post({ 
      title: title,
      content: content,
      author: req.session.userId
    }); // Usa o esquema de Posts para salvar as informações recebidas do corpo da rota
    await newPost.save(); // Salva no banco de dados as informações
    res.redirect('/posts'); // Redireciona o usuário para a aba de posts, com o novo post criado
  } catch (err) {
    console.error(err); // Envia um erro no terminal
    res.send('Erro ao criar post: ' + err.message); // Mostra o erro no navegador
  }
});

// Mostra um post específico
router.get('/:id', requireLogin, async function(req, res) {
  try {
    var post = await Post.findById(req.params.id); // Busca o post pelo id

    if (!post || post.author.toString() !== req.session.userId) {
      return res.send('Post não encontrado ou você não tem permissão.'); // Verificação
    }

    res.render('posts/show', { post: post }); // Exibe a view 'show' e passa as informações direto para ela
  } catch (err) {
    console.error(err);
    res.send('Erro ao buscar post: ' + err.message);
  }
});

// Mostra formulário de edição
router.get('/:id/edit', requireLogin, async function(req, res) {
  try {
    var post = await Post.findById(req.params.id); // Busca o post pelo id (gerado automaticamente e salvo no banco de dados para qualquer documento criado)

    if (!post || post.author.toString() !== req.session.userId) {
      return res.send('Post não encontrado ou você não tem permissão.'); // Envia a mensagem caso o post não exista ou caso o usuário que está tentando acessar o post não é o autor
    }

    res.render('posts/edit', { post: post }); // Exibe na aba posts/edit as informações do post
  } catch (err) {
    console.error(err); // Mostra o erro no terminal
    res.send('Erro ao buscar post: ' + err.message); // Mostra o erro no navegador
  }
});

// Salva a edição do post
router.post('/:id/edit', requireLogin, async function(req, res) {
  try {
    var post = await Post.findById(req.params.id); // Busca o post pelo id

    if (!post || post.author.toString() !== req.session.userId) {
      return res.send('Post não encontrado ou você não tem permissão.'); // Faz a verificação para saber se o post existe e se pertence ao usuário que está logado no site
    }

    post.title = req.body.title; // Define um novo título (mantendo se não houver alterações)
    post.content = req.body.content; // Define um novo conteúdo (mantendo se não houver alterações)
    await post.save(); // Salva as informações atualizadas relacionadas àquele post no banco de dados

    res.redirect('/posts'); // Redireciona o usuário à aba de posts
  } catch (err) {
    console.error(err); // Mostra um erro no console
    res.send('Erro ao editar post: ' + err.message); // Mostra o erro no navegador
  }
});

// Exclui o post
router.post('/:id/delete', requireLogin, async function(req, res) {
  try {
    var post = await Post.findById(req.params.id); // localiza o post pelo id

    if (!post || post.author.toString() !== req.session.userId) {
      return res.send('Post não encontrado ou você não tem permissão.'); // Faz a mesma checagem para saber se o post existe e se o usuário acessando é o autor
    }

    await Post.deleteOne({ _id: req.params.id }); // Deleta o post com o id passado
    res.redirect('/posts'); // Redireciona à aba posts, atualizando a lista de posts
  } catch (err) {
    console.error(err); // Mostra um erro no console 
    res.send('Erro ao excluir post: ' + err.message); // Mostra o erro no navegador
  }
});

module.exports = router;
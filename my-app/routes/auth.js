var express = require('express');
var router = express.Router();
var User = require('../models/User');

// Apenas mostra a rota de cadastro, com o formulário
router.get('/register', function(req, res) {
  res.render('register');
});

// Processa e trata o processo de cadastro de um usuário
router.post('/register', async function(req, res) {
  try {
    const { username, email, password } = req.body; // Pego as informações do corpo da rota
    const newUser = new User({ username, email, password }); // Crio uma nova instância/objeto de um Usuário com os atributos referentes ao esquema User
    await newUser.save(); // Salvo as informações no banco de dados
    res.redirect('/auth/login'); // Redireciono o usuário para uma rota de login
  } catch (err) {
    console.error(err); // Mostra um erro pelo terminal indicando algum erro relacionado ao registro de um usuário
    res.send('Erro ao cadastrar: ' + err.message); // Mostra a mensagem no navegador
  }
});

// Mostra a página de login, com formulário
router.get('/login', function(req, res) {
  res.render('login');
});

// Processa e trata o processo de login
router.post('/login', async function(req, res) {
    try {
        const { email, password } = req.body; // Pega as informações do corpo da rota
        var user = await User.findOne({ email: email }); // Faz a busca pelo usuário com aquele e-mail registrado

        if (!user) {
            return res.send('Usuário não encontrado'); // Se o e-mail não for encontrado, o usuário ainda não foi cadastrado
        }

        // Processo para comparação do hash da senha digitada e o da senha salva no banco de dados
        var isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.send('Senha incorreta'); // retorna uma mensagem informando o usuário que a senha digitada é incorreta (não houve match no hash)
        }

        req.session.userId = user._id; // Salva o id de usuário no servidor, para que o express-session possa gerar um ID de sessão usar depois em outras requisições
        res.redirect('/'); // Redirecionamento para a página inicial
    } catch (err) {
        console.error(err);
        res.send('Erro ao logar: ' + err.message);
    }
});

// Logout (Destrói o cookie referente ao registro do usuário no site e redireciona-o para a página de login)
router.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/auth/login');
  });
});

module.exports = router;
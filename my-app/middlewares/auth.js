// Uma função de autenticação para que os usuários que não estão logados não possam ver os posts de outros usuários
// Checa se existe uma session; se não existe, a função redireciona para a rota de login do usuário
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next(); // passa para quaisquer próximos middlewares usados nas rotas
}

module.exports = requireLogin;
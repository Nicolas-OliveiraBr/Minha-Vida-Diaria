var express = require('express');
var router = express.Router();
var requireLogin = require('../middlewares/auth'); // Reaproveitando o middleware de checagem de registro para redirecionar o usuário para a aba posts

/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
  res.redirect('/posts')
});

module.exports = router;

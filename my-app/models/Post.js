var mongoose = require('mongoose');

// Criando o esquema para os Posts, que serão as páginas do diário
var postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Um título para o dia em que se escreve o diário
  content: { type: String, required: true }, // O conteúdo, que é uma caixa de texto
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Aponta para o usuário que criou aquele post
}, { timestamps: true }); // Mesma lógica utilizada para 'User.js', onde os atributos 'createdAt' e 'updatedAt' são criados

// Exporta o esquema do mongoose
module.exports = mongoose.model('Post', postSchema);
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Um nome para o usuário
  email: { type: String, required: true, unique: true }, // Um e-mail associado ao usuário
  password: { type: String, required: true } // Uma senha
}, { timestamps: true }); // Cria automaticamente outros atributos (createdAt e updatedAt) que salvam a data de criação/atualização do documento

// Antes de salvar, criptografa a senha automaticamente
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método pra comparar senha digitada com a senha criptografada, usado para identificar se o hash da senha digitada é o mesmo da senha salva no banco de dados
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Aqui exportamos o nome do modelo e o seu respectivo esquema, com os atributos
module.exports = mongoose.model('User', userSchema);
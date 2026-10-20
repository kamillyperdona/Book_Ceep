const FuncionarioModel = require('../models/funcionario.model');

const AuthController = {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      
      // Busca a funcionária pelo e-mail na base de dados
      const funcionario = await FuncionarioModel.findByEmail(email);

      // Se não encontrar o e-mail ou a senha estiver errada, bloqueia o acesso
      if (!funcionario || funcionario.senha !== senha) {
        return res.status(401).json({ 
          sucess: false, 
          message: 'E-mail ou senha inválidos. Verifique os seus dados.' 
        });
      }

      // Login autorizado com sucesso
      return res.status(200).json({ 
        sucess: true, 
        message: 'Login bem-sucedido!', 
        usuario: { 
          id: funcionario.id_funcionario, 
          nome: funcionario.nome_funcionario, 
          email: funcionario.email, 
          cargo: funcionario.cargo 
        } 
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;

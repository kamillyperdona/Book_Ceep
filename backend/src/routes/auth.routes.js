const express = require('express');
const router = express.Router();
const transporter = require('../config/email');
const db = require('../config/db'); // Aceder à base de dados biblioteca.funcionario

// --- ROTA DE LOGIN ---
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Procura o funcionário com o e-mail e senha correspondentes
    const [rows] = await db.query(
      'SELECT * FROM biblioteca.funcionario WHERE email = ? AND senha = ?', 
      [email, senha]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }

    const funcionario = rows[0];

    // 2. Retorna sucesso e os dados do funcionário
    return res.json({ 
      success: true, 
      message: 'Login efetuado com sucesso!', 
      funcionario: {
        id: funcionario.id_funcionario,
        nome: funcionario.nome_funcionario,
        email: funcionario.email,
        cargo: funcionario.cargo
      } 
    });

  } catch (error) {
    console.error('Erro ao efetuar login:', error);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor ao tentar fazer login.' });
  }
});

// --- ROTA DE RECUPERAÇÃO DE SENHA ---
router.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Verifica se o e-mail existe na base de dados
    const [rows] = await db.query('SELECT * FROM biblioteca.funcionario WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'E-mail não encontrado no sistema da biblioteca.' });
    }

    const funcionario = rows[0];

    // 2. Define o conteúdo do e-mail
    const mailOptions = {
      from: '"BookCeep - Biblioteca CEEP" <kamilly.panzenhagen.perdona@gmail.com>',
      to: email,
      subject: 'Recuperação de Senha - Sistema BookCeep',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1e2b37;">BookCeep - Recuperação de Credenciais</h2>
          <p>Olá, <strong>${funcionario.usuario || 'Funcionário(a)'}</strong>!</p>
          <p>Recebemos uma solicitação para recuperar o acesso à sua conta no sistema da biblioteca.</p>
          <p>A sua senha registada atualmente no sistema é: <strong style="color: #1e2b37; font-size: 1.1rem;">${funcionario.senha}</strong></p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 0.78rem; color: #777;">Se não solicitou esta recuperação, por favor ignore esta mensagem.</p>
        </div>
      `
    };

    // 3. Envia o e-mail
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: 'E-mail de recuperação enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao enviar o e-mail de recuperação.' });
  }
});

module.exports = router;

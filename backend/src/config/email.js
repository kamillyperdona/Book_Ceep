const nodemailer = require('nodemailer');

// Configuração do transportador de e-mail (Exemplo utilizando o Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kamilly.panzenhagen.perdona@gmail.com', // Substitua pelo e-mail institucional/pessoal que enviará a mensagem
    pass: 'garpfpimotdriuis '
  }
});

module.exports = transporter;

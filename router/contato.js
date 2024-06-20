// contato.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const Contato = express.Router();
Contato.use(bodyParser.json());
Contato.use(cors());

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'compiladodeleis@hotmail.com',
    pass: 'hgtjijmvhnaqucyj' // Use sua senha de aplicativo
  }
});

Contato.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: 'compiladodeleis@hotmail.com',
    to: 'compiladodeleis@hotmail.com',
    subject: 'Novo comentário do usuário',
    text: `Nome do usuário: ${name}\n\nEmail do usuário: ${email}\n\nMensagem: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).json({ success: 'Email enviado com sucesso!', response: info.response });
  });
});

module.exports = Contato;

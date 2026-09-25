const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: true, mensagem: 'Token não informado!' });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: true, mensagem: 'Token inválido ou expirado!' });
    }
}

function permitir(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: true, mensagem: 'Você não tem permissão para executar esta ação!' });
        }
        next();
    };
}

module.exports = { verificarToken, permitir };

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    let token;
    if (authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7).trim();
    } else {
        token = authHeader.trim();
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // This requires req.user.roleName to be populated or stored in token
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

module.exports = { authMiddleware, restrictTo };

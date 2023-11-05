import { expressjwt } from "express-jwt";

export const checkUser = expressjwt({
    secret: "mySecretKey",
    algorithms: ["HS256"]
});

export const onlyAdmin = (req, res, next) => {
    const isAdmin = req.auth.isAdmin;

    if (!isAdmin) {
        const err = new Error('You cannot access this function.');
        err.name = 'RoleMismatchError';
        next(err);
        return;
    }

    next(null, req, res, next);
}

export const handleRoleMismatchError = (err, req, res, next) => {
    if (err.name === "RoleMismatchError") {
        res.status(403).send({ error: err.message });
    } else {
        next(err);
    }
};

export const handleAuthorizationError = (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).send({ error: 'Authentication is required for this operation.' });
    } else {
        next(err);
    }
};
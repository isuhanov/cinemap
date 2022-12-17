import jwt from'jsonwebtoken';
import { tokenKey } from '../../lib/token.js';

function checkJwt(req, res, next) {
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.split(' ')[1], tokenKey, function(err, decoded) {
            console.log(err);
            if (err) res.status(401).send('You Unauthorised')
            else next()
        });
    }
    next();
}

export default checkJwt;
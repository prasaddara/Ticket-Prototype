const jwt = require('jsonwebtoken');
const { models } = require('../models');
const SECRET = process.env.JWT_SECRET || 'supersecret';

async function authenticate(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, SECRET);
    const user = await models.User.findByPk(payload.id);
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(roles=[]){
  return (req,res,next)=>{
    if(!roles.length) return next();
    if(!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  }
}

module.exports = { authenticate, authorize };

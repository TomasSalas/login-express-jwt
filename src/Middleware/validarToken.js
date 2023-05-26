import jwt from 'jsonwebtoken'

export async function validateToken (req , res ,next) {
  const accessToken = req.headers['authorization']
  if(!accessToken){
    res.status(401).json({ error: 'Access Denied' });
  }

  jwt.verify(accessToken , process.env.SECRET_TOKEN , (err , data) => {
    if(err){
      res.status(401).json({ error: 'Token expired or invalid' });
    }else{
      next();
    }
  });
}
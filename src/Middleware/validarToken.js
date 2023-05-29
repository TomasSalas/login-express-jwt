import jwt from 'jsonwebtoken'

export async function validateToken (req , res ,next) {
  try{
    const accessToken = req.headers['authorization']
    if(!accessToken){
      return res.status(401).json({ error: 'Access Denied' });
    }
  
    jwt.verify(accessToken , process.env.SECRET_TOKEN , (err , data) => {
      if(err){
        return res.status(401).json({ error: 'Token expired or invalid' });
      }else{
        next();
      }
    });
  }catch(err){
    return res.status(401).json({ error: 'Access Denied' });
  }
}
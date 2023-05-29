import { pool } from '../Config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateToken } from '../Middleware/validarToken.js'

export const signin = async (req, res) => {
  const { email, password } = req.body

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])

  if (rows.length === 0) {
    return res.json({ error: 'ERROR_LOGIN_USER_NOT_LOGIN', 'data': null })
  }
  const passwordUser = rows[0].password

  let isMatch = await bcrypt.compare(password, passwordUser)

  if (!isMatch) {
    return res.json({ error: 'ERROR_LOGIN_USER_NOT_LOGIN', 'data': null })
  }

  const payload = {
    sub: rows[0].id,
    role: null,
  }

  const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 60 * 10 })

  res.json({
    error: null,
    token: token,
    data: { 'name': rows[0].name, 'lastname': rows[0].lastname, 'email': rows[0].email },
  })
}

export const createUser = async (req, res) => {
  await validateToken(req, res, async () => {
    try {
      const { name, lastname, email, password } = req.body;

      const passwordBy = await bcrypt.hash(password, 10);

      const [rows] = await pool.query(
        'INSERT INTO users (name, lastname, email, password) VALUES (?, ?, ?, ?)',
        [name, lastname, email, passwordBy]
      );

      if (rows.affectedRows !== 1) {
        return res.json({ Error: 'Error Inserting User' });
      }

      return res.json({ Error: null, message: `${rows.affectedRows} usuario creado` });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return res.json({ Error: 'ER_DUP_ENTRY', message: 'User already exists' });
      }
      return res.json({ Error: 'Error inserting user' });
    }
  });
};

export const changePassword = async (req, res) => {
  await validateToken(req, res, async () => {
    const { passwordCurrent, passwordNew, user } = req.body

    if (passwordCurrent === passwordNew) {
      return res.json({ ERROR: 'THE NEW PASSWORD CANNOT BE THE SAME AS THE CURRENT PASSWORD' });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [user])

    if (rows.length === 0) {
      return res.json({ ERROR: 'USER NOT FOUND' })
    }
    const passwordCurrentBD = rows[0].password


    const compare = await bcrypt.compare(passwordCurrent, passwordCurrentBD)

    if (!compare) {
      return res.json({ ERROR: 'Password Currently is not a valid password' })
    }

    const passwordBy = await bcrypt.hash(passwordNew, 10)

    const [updatePassword] = await pool.query('UPDATE users SET password = ? WHERE user = ?', [passwordBy, user])

    if (updatePassword.affectedRows == 1) {
      res.json({ ERROR: null, data: 'CHANGE_PASSWORD_UPDATED' })
    }
  });
};

export const viewUsers = async (req, res) => {
  try{
    await validateToken(req , res ,async () =>{
      try{
        const [rows] = await pool.query('SELECT * FROM users where status = 1')
  
        if (rows.length === 0) {
          return res.json({ error: 'USERS NOT FOUND' })
        }
    
        res.json({error: null , data: rows})
      }catch(err){
        res.json({ error: err.message})
      }
      
    });
  }catch(err){
    res.json({ error: "access denied" })
  }

};

export const deleteUser = async (req, res) => {
  console.log(req.body)
  try{
    await validateToken(req , res ,async () =>{
      try{
        const [rows] = await pool.query('UPDATE users SET status = 0 where id = ?', [req.body.id])
  
        if (rows.length === 0) {
          return res.json({ error: 'USERS NOT FOUND' })
        }
    
        res.json({error: null , data: rows})
      }catch(err){
        res.json({ error: err.message})
      }
      
    });
  }catch(err){
    res.json({ error: "access denied" })
  }

};
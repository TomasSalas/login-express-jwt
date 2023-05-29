import { Router } from 'express'
import { signin , createUser  , changePassword , viewUsers , deleteUser} from '../Controllers/index.js'
 
const router = Router()

router.post('/signin' , signin)
router.post('/createUser' , createUser)
router.post('/changerPassword' , changePassword)
router.get('/viewUsers' , viewUsers)
router.post('/deleteUser' , deleteUser)



export default router
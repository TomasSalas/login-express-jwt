import { Router } from 'express'
import { signin , createUser  , changePassword} from '../Controllers/index.js'
 
const router = Router()

router.post('/signin' , signin)
router.post('/createUser' , createUser)
router.post('/changerPassword' , changePassword)



export default router
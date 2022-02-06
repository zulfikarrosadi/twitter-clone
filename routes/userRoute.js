const { Router } = require('express');
const userValidationSchema = require('../constant/userValidationSchema');
const { addUser } = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');

const router = Router();

router.post('/', validateUser(userValidationSchema), addUser);

module.exports = router;

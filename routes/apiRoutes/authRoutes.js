const router = require('express').Router(); 
const passportService = require('./../../services/passport');
const authController = require('./../../controllers/authController');
const authMiddleware = require('./../../middlewares/authMiddleware');


// /api/auth/signup
router.route('/signup')
  .post(authController.signUp);

router.route('/signin')
  .post(authMiddleware.requireSignIn, authController.signIn);




module.exports = router;
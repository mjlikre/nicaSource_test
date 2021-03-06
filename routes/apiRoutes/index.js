const router      = require('express').Router();
const authRoutes  = require('./authRoutes');
const passportService = require('./../../services/passport');
const authMiddleware = require('./../../middlewares/authMiddleware');


router.route('/test')
  .get(authMiddleware.requireAuth, (req, res) => {
    res.send({success: true});
  });
router.use('/auth', authRoutes);

module.exports = router;
const router      = require('express').Router();
const authRoutes  = require('./authRoutes');
const dataRoutes  = require('./dataRoutes');
const passportService = require('./../../services/passport');
const authMiddleware = require('./../../middlewares/authMiddleware');


router.route('/test')
  .get(authMiddleware.requireAuth, (req, res) => {
    res.send({success: true});
  });
router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
module.exports = router;
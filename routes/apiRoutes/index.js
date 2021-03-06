const router      = require('express').Router();
const authRoutes  = require('./authRoutes');
const passportService = require('./../../services/passport');
const authMiddleware = require('./../../middlewares/authMiddleware');

router.route('/test')
  .get(authMiddleware.requireAuth, (req, res) => {
      console.log(req.user)
      console.log("lol")
    res.send("success");
  });
router.use('/auth', authRoutes);

module.exports = router;
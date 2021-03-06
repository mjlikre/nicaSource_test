const router      = require('express').Router();
const authRoutes  = require('./authRoutes');

router.route('/test')
  .get((req, res) => {
      console.log("lol")
    res.send("success");
  });
router.use('/auth', authRoutes);

module.exports = router;
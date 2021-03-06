const router      = require('express').Router();
const authRoutes  = require('./authRoutes');
const dataRoutes  = require('./dataRoutes');
const passportService = require('./../../services/passport');
const authMiddleware = require('./../../middlewares/authMiddleware');
const dataController = require('./../../controllers/dataController');

router.route('/test')
  .get(authMiddleware.requireAuth, (req, res) => {
    res.send({success: true});
  });
router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
router.route("/sync")
    .get(authMiddleware.requireAuth, dataController.sync)
router.route("/statistics")
    .get(authMiddleware.requireAuth, dataController.getStatistics)
router.route("/statistics/:country_id")
    .get(authMiddleware.requireAuth, dataController.getSpecificStatistics)
router.route("/statistics/:country_id")
    .post(authMiddleware.requireAuth, dataController.postSpecificStatistics)
module.exports = router;
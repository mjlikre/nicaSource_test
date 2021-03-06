const router = require('express').Router(); 
const passportService = require('./../../services/passport');
const dataController = require('./../../controllers/dataController');
const authMiddleware = require('./../../middlewares/authMiddleware');

router.route("/sync")
    .get(dataController.sync)





module.exports = router;
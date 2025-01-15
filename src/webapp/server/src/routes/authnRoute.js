const { Signup, Login } = require("../controllers/authnController");
const { userVerification } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/api/authn/signup", Signup);
router.post('/api/authn/login', Login);
router.post('/', userVerification);

module.exports = router;
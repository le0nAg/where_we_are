const { Signup, Login, Logout, RefreshToken, CheckAuth } = require("../controllers/authnController");
const { userVerification } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/api/authn/signup", Signup);
router.post('/api/authn/login', Login);
router.post('/api/authn/logout', Logout);
router.post('/api/authn/refresh', RefreshToken);
router.post('/api/authn/check-aut', CheckAuth);


module.exports = router;
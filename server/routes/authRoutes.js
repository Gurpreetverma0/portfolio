import express from 'express';
import { loginAdmin, logoutAdmin, getMe, changePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, changePasswordSchema } from '../validators/schemas.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginRateLimiter, validateBody(loginSchema), loginAdmin);
router.post('/logout', protectAdmin, logoutAdmin);
router.get('/me', protectAdmin, getMe);
router.put('/password', protectAdmin, validateBody(changePasswordSchema), changePassword);

export default router;

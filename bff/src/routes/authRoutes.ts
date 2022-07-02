import express from 'express';

import * as auth from '../controllers/authController';

const router = express.Router();

router.route('/login').post(auth.login);
router.route('/currentSession').get(auth.currentSession);
router.route('/renewSession').get(auth.renewSession);
router.route('/register').post(auth.register);
router.route('/logout').get(auth.logout);

export default router;
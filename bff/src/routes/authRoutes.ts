import express from 'express';

import { validate, authSchemas } from './validator';
import * as auth from '../controllers/authController';

const router = express.Router();

router.route('/login').post(validate({body: authSchemas.loginSch}), auth.login);
router.route('/currentSession').get(auth.currentSession);
router.route('/renewSession').get(auth.renewSession);
router.route('/register').post(validate({body: authSchemas.registerSch}), auth.register);
router.route('/logout').get(auth.logout);

export default router;
import express from 'express';

import * as user from '../controllers/userController';

const router = express.Router();

router.route('/').get(user.getUsers);

router.route('/:userId').get(user.getUser);
router.route('/:userId').patch(user.updateUser);
router.route('/:userId').delete(user.deleteUser);

router.route('/:userId/upload').post(user.updateAvatar);

export default router;
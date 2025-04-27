import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'ФХМ API' });
});

export default router;

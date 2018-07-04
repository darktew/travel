const express = require('express');
const router = express.Router();

const job = require('../controllers/job.controller');

router.get('/', job.getJobs);
router.post('/', job.createJob);
router.get('/:id', job.getJob);
router.put('/:id', job.editJob);
router.delete('/:id', job.deleteJob);

module.exports = router;
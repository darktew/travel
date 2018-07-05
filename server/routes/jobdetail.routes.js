const express = require('express');
const router = express.Router();

const jobdetail = require('../controllers/jobdetail.controller');

router.get('/', jobdetail.getJobsdetail);
router.post('/', jobdetail.createJobdetail);
router.get('/:id', jobdetail.getJobdetail);
router.put('/:id', jobdetail.editJobdetail);
router.delete('/:id', jobdetail.deleteJobdetail);

module.exports = router;
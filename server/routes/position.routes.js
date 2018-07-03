const express = require('express');
const router = express.Router();

const position = require('../controllers/position.controller');

router.get('/', position.getPositions);
router.post('/', position.createPosition);
router.get('/:id', position.getPosition);
router.put('/:id', position.editPosition);
router.delete('/:id', position.deletePosition);

module.exports = router;
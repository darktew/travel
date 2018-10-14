const express = require('express');
const router = express.Router();

const position = require('../controllers/position.controller');

router.get('/', position.getPositions);
router.post('/', position.createPosition);
router.get('/:id', position.getPosition);
router.get('/employee/:employee_id', position.getPositionByEmployeeId);
router.put('/:id', position.editPosition);
router.delete('/:id', position.deletePosition);
router.delete('/employee/:id', position.deletePositionAll)

module.exports = router;
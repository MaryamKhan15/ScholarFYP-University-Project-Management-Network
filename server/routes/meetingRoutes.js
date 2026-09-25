const express = require('express');
const router = express.Router();
const { createMeeting, getMyMeetings, updateMeeting } = require('../controllers/meetingController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createMeeting);
router.get('/', verifyToken, getMyMeetings);
router.put('/:id', verifyToken, updateMeeting);

module.exports = router;

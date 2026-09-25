const express = require('express');
const router = express.Router();
const {
  createProposal,
  getMyProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  reviewProposal,
  aiAssistProposal,
} = require('../controllers/proposalController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.post('/', verifyToken, authorizeRoles('student'), createProposal);
router.get('/my', verifyToken, authorizeRoles('student'), getMyProposal);
router.post('/ai-assist', verifyToken, aiAssistProposal);
router.get('/', verifyToken, authorizeRoles('supervisor', 'admin'), getAllProposals);
router.get('/:id', verifyToken, getProposalById);
router.put('/:id', verifyToken, authorizeRoles('student'), updateProposal);
router.post('/:id/review', verifyToken, authorizeRoles('supervisor', 'admin'), reviewProposal);

module.exports = router;

const express = require('express');
const router = express.Router();
const { models } = require('../models');
const { authorize } = require('../middleware/auth');

// list users (admin only)
router.get('/', authorize(['admin']), async (req,res)=>{
  const users = await models.User.findAll({ attributes: ['id','name','email','role'] });
  res.json(users);
});

module.exports = router;

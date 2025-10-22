const express = require('express');
const router = express.Router();
const { models } = require('../models');
const { authorize } = require('../middleware/auth');

// helper: send email (basic)
async function sendMail(to, subject, text){
  // For production, configure SMTP (SES/SendGrid). Here we log to console for prototype.
  console.log('Sending email to', to, subject);
}

// Create ticket (customer)
router.post('/', authorize(['customer','admin','agent']), async (req,res)=>{
  const { subject, description, priority } = req.body;
  const ticket = await models.Ticket.create({ subject, description, priority, customerId: req.user.id });
  // notify agents
  const agents = await models.User.findAll({ where: { role: 'agent' } });
  for(const a of agents) sendMail(a.email, 'New ticket created', 'Ticket: '+subject);
  res.json(ticket);
});

// List tickets (all roles see different scopes)
router.get('/', async (req,res)=>{
  const role = req.user.role;
  let tickets;
  if(role === 'customer'){
    tickets = await models.Ticket.findAll({ where: { customerId: req.user.id }, include: ['customer','agent','comments'] });
  }else if(role === 'agent'){
    tickets = await models.Ticket.findAll({ include: ['customer','agent','comments'] });
  }else{ // admin
    tickets = await models.Ticket.findAll({ include: ['customer','agent','comments'] });
  }
  res.json(tickets);
});

// Assign ticket (agent/admin)
router.post('/:id/assign', authorize(['admin','agent']), async (req,res)=>{
  const { agentId } = req.body;
  const t = await models.Ticket.findByPk(req.params.id);
  if(!t) return res.status(404).json({ message: 'Not found' });
  t.agentId = agentId;
  await t.save();
  const agent = await models.User.findByPk(agentId);
  sendMail(agent.email, 'Ticket assigned', 'Ticket assigned: '+t.subject);
  res.json(t);
});

// Add comment
router.post('/:id/comments', async (req,res)=>{
  const t = await models.Ticket.findByPk(req.params.id);
  if(!t) return res.status(404).json({ message: 'Not found' });
  const comment = await models.Comment.create({ content: req.body.content, ticketId: t.id, authorId: req.user.id });
  res.json(comment);
});

// Change status
router.post('/:id/status', authorize(['admin','agent']), async (req,res)=>{
  const { status } = req.body;
  const t = await models.Ticket.findByPk(req.params.id);
  if(!t) return res.status(404).json({ message: 'Not found' });
  t.status = status;
  await t.save();
  // notify customer
  const customer = await models.User.findByPk(t.customerId);
  if(customer) sendMail(customer.email, 'Ticket status updated', 'Ticket "'+t.subject+'" status: '+status);
  res.json(t);
});

module.exports = router;

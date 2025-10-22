const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING } // 'admin' | 'agent' | 'customer'
});

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  subject: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  priority: { type: DataTypes.STRING, defaultValue: 'Normal' },
  status: { type: DataTypes.STRING, defaultValue: 'Open' } // Open | In Progress | Closed
});

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT }
});

User.hasMany(Ticket, { as: 'tickets', foreignKey: 'customerId' });
Ticket.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });
User.hasMany(Ticket, { as: 'assignedTickets', foreignKey: 'agentId' });
Ticket.belongsTo(User, { as: 'agent', foreignKey: 'agentId' });
Ticket.hasMany(Comment, { as: 'comments', foreignKey: 'ticketId' });
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
Comment.belongsTo(Ticket, { as: 'ticket' , foreignKey: 'ticketId'});

async function initDb(){
  await sequelize.sync({ force: true });
  // create default users
  const bcrypt = require('bcrypt');
  const pwd = await bcrypt.hash('password', 10);
  await User.create({ name: 'Admin User', email: 'admin@example.com', passwordHash: pwd, role: 'admin' });
  await User.create({ name: 'Agent One', email: 'agent@example.com', passwordHash: pwd, role: 'agent' });
  await User.create({ name: 'Customer One', email: 'customer@example.com', passwordHash: pwd, role: 'customer' });
}

module.exports = { initDb, models: { User, Ticket, Comment }, sequelize };

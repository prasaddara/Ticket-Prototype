const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initDb, models } = require('./models');
const authRouter = require('./routes/auth');
const ticketsRouter = require('./routes/tickets');
const usersRouter = require('./routes/users');
const { authenticate } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/tickets', authenticate, ticketsRouter);

const PORT = process.env.PORT || 4000;

initDb().then(()=>{
  app.listen(PORT, ()=>{
    console.log('Backend listening on', PORT);
    console.log('Default users created: admin@example.com (password: password)');
  });
}).catch(err=>console.error(err));

# Backend - Ticket Management module
## Quick start
1. cd backend
2. npm install
3. npm start
4. Server runs on http://localhost:4000
## Default users
- admin@example.com / password
- agent@example.com / password
- customer@example.com / password
## Notes
- This prototype uses SQLite for simplicity. For production use PostgreSQL or MySQL.
- Email sending is stubbed to console; configure SMTP in routes/tickets.js sendMail for real emails.

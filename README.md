# Ticket Management module

## Overview
Minimal functional prototype of a Ticket Management module:
- Roles: Admin, Agent, Customer
- Create ticket, assign ticket, comment, change status
- Backend: Express + Sequelize (SQLite)
- Frontend: React + Vite
- Auth: JWT
- Docker-compose included for quick local dev

## Quick run (without docker)
1. Backend:
   cd backend
   npm install
   npm start
   - backend will run on http://localhost:4000
2. Frontend:
   cd frontend
   npm install
   npm run dev
   - frontend will run on http://localhost:5173 (open in browser)

## Quick run (with docker)
- Ensure Docker is installed, then run from repository root:
  docker-compose up --build

## API Examples (curl)
1. Login as admin:
   curl -X POST http://localhost:4000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@example.com","password":"password"}'

2. Create ticket (as customer):
   # login as customer first to get token, then:
   curl -X POST http://localhost:4000/api/tickets -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' -d '{"subject":"Test","description":"desc","priority":"High"}'

3. Assign ticket (admin/agent):
   curl -X POST http://localhost:4000/api/tickets/<ID>/assign -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' -d '{"agentId":2}'

4. Add comment:
   curl -X POST http://localhost:4000/api/tickets/<ID>/comments -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' -d '{"content":"This is a comment"}'

5. Change status:
   curl -X POST http://localhost:4000/api/tickets/<ID>/status -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' -d '{"status":"In Progress"}'

## Notes for the high-level document
- This scaffold focuses on demonstrating the main flows; replace SQLite with PostgreSQL for production.
- Email sending is logged to console; configure real SMTP in routes/tickets.js sendMail function.
- Add validations, RBAC checks, and pagination for production readiness.
- CI/CD: create pipelines to run tests, build images, push images, and deploy to staging/production.

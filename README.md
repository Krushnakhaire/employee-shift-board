A role-based Employee Shift Management system built using the MERN stack.
Admin can create/manage shifts, and employees can view only their own schedules.

🚀 Features

JWT Authentication (Admin & Employee)

Admin: Create/Delete shifts

Validations: No overlap, min 4 hours

Employee: View only own shifts

Date-based shift filtering

Interactive & responsive UI

🔧 Tech Stack

Frontend: React (Vite), Modern CSS
Backend: Node.js, Express.js, MongoDB, Mongoose, JWT

▶️ Setup
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev


Run both together:

npm start

🔑 Login Credentials

Admin

Email: hire-me@anshumat.org
Password: HireMe@2025!


Employee

Email: user@example.com
Password: User@1234

📌 APIs

POST /api/auth/login

GET /api/employees

POST /api/shifts

GET /api/shifts

DELETE /api/shifts/:id

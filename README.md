# 🧠 Smart Ticket & Issue Management System

A role-based, scalable support ticketing platform built using **ASP.NET Core Web API** and **Angular**, designed to manage issue reporting, assignment, escalation, SLA tracking, and resolution across multiple organizational roles.

---

## 📌 Project Overview

The **Smart Ticket & Issue Management System** provides a centralized platform for managing internal or external support requests.  
It enforces structured workflows, role-based access, SLA compliance, and full auditability.

The system is designed with **Clean Architecture principles** and is production-ready.

---

## 🎯 Objectives

- Centralize issue reporting and tracking  
- Automate ticket assignment and SLA handling  
- Enable role-based workflows  
- Maintain a complete activity audit trail  
- Ensure scalability and maintainability  

---

## 👥 User Roles & Capabilities

### 1. End User
- Create tickets  
- View ticket details and history  
- Add comments  
- Cancel tickets  
- Reopen closed tickets  
- Escalate tickets  

### 2. Support Agent
- View assigned tickets  
- Update ticket status  
- Add comments  
- Resolve tickets  

### 3. Support Manager
- View ticket queue  
- Manually assign tickets  
- Monitor SLA breaches  
- View escalated tickets  

### 4. Admin
- Approve or reject users  
- Assign roles  
- Manage master data:
  - Categories  
  - Priorities  
  - SLA Policies  

---

## 🏗️ System Architecture

**Architecture Pattern:** Clean Architecture

### High-Level Flow

1. Angular frontend sends HTTP requests  
2. JWT-secured requests reach ASP.NET Core Web API  
3. Application layer handles business rules  
4. Domain layer enforces entities and invariants  
5. Infrastructure layer manages database access via EF Core  
6. SQL Server persists data  
7. Response returned to frontend dashboards  

---

## 🛠️ Technology Stack

### Frontend
- Angular  
- Angular Material  
- TypeScript  
- RxJS  

### Backend
- ASP.NET Core Web API (.NET 8)  
- Entity Framework Core  
- Clean Architecture  

### Database
- SQL Server (Docker-based)  

### Security
- JWT Authentication  
- Role-Based Authorization  

### Tooling
- Docker  
- Git & GitHub  
- Visual Studio / VS Code  
- Azure Data Studio  

---

## 🗄️ Database Design (High Level)

### Core Tables
- Users  
- Roles  
- UserRoles  
- Tickets  
- TicketAssignments  
- TicketComments  
- TicketActivities  
- TicketCategories  
- TicketPriorities  
- SLAPolicies  

All ticket-related actions are fully logged in `TicketActivities`.

---

## 🔄 Ticket Lifecycle

Created → Assigned → In Progress → Resolved → Closed
↓
Cancelled
↓
Reopened

yaml
Copy code

Transitions are strictly validated in backend services.

---

## ⏱️ SLA & Auto Assignment

- SLA deadlines calculated using priority-based policies  
- SLA breach detection for unresolved tickets  
- Auto-assignment:
  - If a ticket remains unassigned for a configured duration
  - Assigned to the least-loaded support agent  

---

## 📝 Activity Logging

Every critical action is logged:
- Ticket creation  
- Assignment (manual & auto)  
- Status changes  
- Escalation  
- Comments  

Activity history is visible in ticket details for transparency and auditing.

---

## 🔔 Notifications

Frontend toast notifications (using `ngx-toastr`) for:
- Ticket creation confirmation  
- Status changes  
- Error and validation feedback  

---

## 📁 Project Structure

Capstone_Final/
├── Backend/
│ ├── API/
│ ├── Application/
│ ├── Domain/
│ ├── Infrastructure/
│
├── Frontend/
│ ├── src/app/
│ │ ├── features/
│ │ ├── core/
│ │ ├── shared/
│
├── Application.Tests/
├── Deliverables/

yaml
Copy code

---

## 🚀 Setup Instructions

### Prerequisites

Install the following:
- Node.js (v18+)  
- Angular CLI  
- .NET SDK 8.0  
- Docker  
- Git  

---

🔧 Backend Setup
1. Navigate to Backend

Open a terminal and move into the Backend folder.
Command to run:
cd Backend

2. Restore dependencies

Restore all .NET dependencies for the backend project.
Command to run:
dotnet restore

3. Configure database connection

Open the appsettings.json file in the Backend project and update the connection string with your local SQL Server details.

Connection string example (edit values as needed):
Server = localhost
Database = SmartTicketDB
User Id = sa
Password = StrongPassword@123
TrustServerCertificate = True

Ensure SQL Server credentials match your local or Docker setup.

4. Start SQL Server using Docker

Run SQL Server in a Docker container if it is not already running.

Key details:

SQL Server image: SQL Server 2022

Port: 1433

Username: sa

Password: StrongPassword@123

Make sure Docker is running before executing the command.

5. Apply database migrations

Apply Entity Framework Core migrations to create all tables and seed required data.

Command to run:
dotnet ef database update

6. Run the backend API

Start the ASP.NET Core Web API.

Command to run:
dotnet run

Backend will be available at:
https://localhost:5001

🎨 Frontend Setup
1. Navigate to Frontend

Open a new terminal and move into the Frontend folder.
Command to run:
cd Frontend

2. Install dependencies

Install all Angular and npm dependencies.
Command to run:
npm install

3. Run the Angular application

Start the Angular development server.
Command to run:
ng serve

Frontend will be available at:
http://localhost:4200

🔐 Authentication & Authorization

JWT-based authentication is implemented

Tokens are attached to requests using an Angular HTTP interceptor

Angular route guards enforce role-based navigation

Backend APIs are protected using role-based authorization attributes

Supported roles:

Admin

Support Manager

Support Agent

End User

Each role has controlled access to features and APIs.

📌 Key Achievements

Complete ticket lifecycle management (Create, Assign, In Progress, Resolve, Close, Reopen, Cancel)

Role-based access control across frontend and backend

SLA tracking with breach detection

Ticket escalation handling

Automatic agent assignment based on workload

Ticket activity audit trail for full traceability

Clean layered architecture with separation of concerns

🚧 Future Enhancements

Email notifications for ticket updates

Real-time updates using SignalR

Advanced reporting and analytics dashboards

Multi-tenant architecture support

📄 License

This project was developed as an academic capstone project and is intended for educational and demonstration purposes only.
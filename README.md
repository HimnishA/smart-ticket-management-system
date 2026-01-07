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

## 🔧 Backend Setup

### 1. Navigate to Backend
```bash
cd Backend
2. Restore dependencies
bash
Copy code
dotnet restore
3. Configure database connection
Update appsettings.json:

json
Copy code
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartTicketDB;User Id=sa;Password=StrongPassword@123;TrustServerCertificate=True;"
  }
}
4. Start SQL Server (Docker)
bash
Copy code
docker run -e "ACCEPT_EULA=Y" \
-e "SA_PASSWORD=StrongPassword@123" \
-p 1433:1433 \
--name sqlserver \
-d mcr.microsoft.com/mssql/server:2022-latest
5. Apply migrations
bash
Copy code
dotnet ef database update
6. Run backend
bash
Copy code
dotnet run
Backend URL:

arduino
Copy code
https://localhost:5001
🎨 Frontend Setup
1. Navigate to Frontend
bash
Copy code
cd Frontend
2. Install dependencies
bash
Copy code
npm install
3. Run application
bash
Copy code
ng serve
Frontend URL:

arduino
Copy code
http://localhost:4200
🔐 Authentication & Authorization
JWT-based authentication

Tokens sent via HTTP interceptor

Angular route guards enforce role access

Backend endpoints secured with [Authorize(Roles = "...")]

📌 Key Achievements
Complete ticket lifecycle implementation

Secure role-based access control

SLA tracking and escalation

Auto-assignment logic

Centralized activity audit trail

Clean, scalable architecture

🚧 Future Enhancements
Email notifications

Real-time updates using SignalR

Advanced reporting dashboards

Multi-tenant support

📄 License
This project was developed as an academic capstone project.
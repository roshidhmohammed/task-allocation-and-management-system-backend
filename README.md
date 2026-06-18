 -  # Task allocation and management system - Backend


# Prerequisites

- Node.js (v22+ recommended)

# Instruction to set up the project on the local machine

1. First clone the repo, and execute the below commands:

```bash
git clone https://github.com/roshidhmohammed/task-allocation-and-management-system-backend.git
cd task-allocation-and-management-system-backend
```

2.  3.  Create .env.development and .env.production file on the root on the project folder (outside the src folder) and then add the below fields into the file

```bash
PORT=""
DATABASE_URL=""
JWT_SECRET=''
JWT_EXPIRES=''
NODE_ENV="development" || "production"
COOKIES_EXP_TIME=
```

3.  Install all the dependencies used in this app using the below command:

```bash
npm install
```

4.  Start the project using the below command:

```bash
npm run dev
```

# API Documentation

## User
| Method | Endpoint                            | Description                               |
| ------ | ------------------------------------| ------------------------------------------|
| POST   | `/api/user/`                        | Register User                             |
| POST   | `/api/user/login`                   | Login User                                |
| GET    | `/api/user/check-user-auth`         | checking user authentication              |
| GET    | `/api/user/workload`                | getting the user workload info            |
| PATCH  | `/api/user/update-skills`           | updating the user skills                  |
| PATCH  | `/api/user/update-available-hours`  | updating the user available hours         |
| PATCH  | `/api/user/update-working-days`     | updating the user working days            |
| get    | `/api/user/all`                     | getting all user for assigning users list |


## Tasks
| Method | Endpoint                            | Description                               |
| ------ | ------------------------------------| ------------------------------------------|
| POST   | `/api/task/`                        | Create a new task                         |
| PUT    | `/api/task/:taskId`                 | Update task                               |
| DELETE | `/api/task/:taskId`                 | deleting a task                           |
| GET    | `/api/task/`                        | getting all task                          |
| GET    | `/api/task/categorized-by-status`   | getting tasks and categorized by status   |


## Task Allocation
| Method | Endpoint                              | Description                                                                                   |
| ------ | --------------------------------------| ----------------------------------------------------------------------------------------------|
| POST   | `/api/task-allocation/`               | Creating while assigning user to a task whether failed to meet constraints or meet constraints|
| GET    | `/api/task-allocation/allocated-tasks`| get all allocated tasks                                                                       |
| GET    | `/api/task/not-allocated-tasks`       | get all not allocated tasks                                                                   |


# Assumptions made

1.  The authenticated has permission to create, update, delete task, and assigning user to the task.
2.  Only showing all the users in assigning users list except the authenticated user. The list also includes the creator of the specific task.
3. The task creators can choose the likely given option for status (such as pending, in progress, completed) while creating the task.



# Implemented Indexing strategy on each model and  explanation

## why indexing is used? ##
   - It will directly jump to the matching field documents instead of scanning the entire docs.

1. User Model:
   - skills - while assigning a user to a task, it is needed to match the user skills with task's required skills
   - avaialableWorkingHours - While assigning user to a task, for checking the availability

2. Task Model:
   - status - filtering the task documents by status
   - createdAt - for sorting the documents in ascending order
   - priority - filtering the task documents by status
   - title - searching the task by title (it is not regex based, it only returns the doc matching the exact searching term)
   - assignedUser -query runs every time a task is assigned

3. Task Allocation:
   - taskId -prevents duplicate task allocation
   - assignedUserId - prevents duplicate task allocation



# Project Structure:

src/
  -  config/          # database config
  -  controllers/     # API handlers and business logic
  -  routes/          # API routes and endpoints definition
  -  middlewares/     # middlewares likes authentication, error handling required for all the api endpoints
  -  utils/           # Reusable function logic and input validation functions
  -  app.js
  -  server.js

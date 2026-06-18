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

## Auth
| Method | Endpoint                            | Description                               |
| ------ | ------------------------------------| ------------------------------------------|
| POST   | `/api/auth/`                        | Register User                             |
| POST   | `/api/auth/login`                   | Login User                                |
| GET    | `/api/auth/check-user-auth`         | checking user authentication              |

## User
| Method | Endpoint                            | Description                               |
| ------ | ------------------------------------| ------------------------------------------|
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

# Assumptions and Design Decisions

## 1. User Permissions

The system assumes that an authenticated user has the necessary permissions to:

* Create tasks
* Update tasks
* Delete tasks
* Assign users to tasks

Role-based access control has not been implemented in the current version.

---

## 2. Task Status

When creating a task, users can select one of the predefined status values:

* Pending
* In Progress
* Completed

These statuses help track the progress of each task throughout its lifecycle.

---

## 3. Task Allocation

Task assignment is performed in two stages: user filtering and allocation validation.

### Stage 1: User Filtering

When a user chooses to assign a task, the system first displays a list of eligible users based on the following criteria:

* The currently authenticated user is excluded from the list.
* The user must have at least one skill configured.
* The user must have at least one working day configured.
* The user must have available working hours greater than zero.
* The user's available working hours must fall within the range defined by the task priority.

Example:

```javascript
const priorityLevel = {
  High: { start: 7, end: 9 },
  Medium: { start: 4, end: 6 },
  Low: { start: 1, end: 3 }
};
```

For example, a high-priority task can only be assigned to users whose available working hours fall between 7 and 9 hours per day.

---

### Stage 2: Allocation Check

After a user is selected, the system performs additional validations before assigning the task.

#### Skill Matching

The system compares the user's skills with the skills required for the task.

* If the user skills possesses the required skills, the validation passes.
* Otherways, the allocation fails with a "Skills Mismatch" reason.

---

#### Workload and Availability Check

To determine whether a user has sufficient capacity to take on a new task, the system calculates the user's current workload.

The following approach is used:

1. Retrieve all active tasks already assigned to the user.
2. Consider only tasks whose due dates fall between the current date and the due date of the task being assigned.
3. Sum the estimated hours of those tasks to determine the user's current workload.

Next, the system calculates the user's available capacity:

```text
1. Number of Working Days = Total working days between today and the task due date

2. Total Available Hours = Number of Working Days × User's Available Working Hours Per Day

3. Remaining Capacity = Total Available Hours − Current Workload

4. If Remaining Capacity is less than the Estimated Hours required for the new task, the allocation fails.
```

In this scenario, the task is considered not assignable because the user does not have enough available capacity before the due date.

---

#### Due Date Validation

The system validates that the task due date has not already passed.

```text
If the current date is later than the task due date, the task cannot be assigned.
```

Any allocation attempt that fails due to an expired due date is recorded as a failed allocation.

---

## Allocation Audit Trail

Every task allocation attempt is recorded in the Task Allocation collection, regardless of whether it succeeds or fails.

This allows the system to:

* Track allocation history
* Record reasons for failed allocations


# Implemented Indexing strategy on each model and  explanation

## why indexing is used? ##
   - It will directly jump to the matching field documents instead of scanning the entire docs.

1. User Model:
   - skills - while assigning a user to a task, it is needed to match the user skills with the task's required skills
   - avaialableWorkingHours - While assigning user to a task, for checking the availability

2. Task Model:
   - status - filtering the task documents by status
   - createdAt - for sorting the documents in ascending order
   - priority - filtering the task documents by status
   - dueDate -  Needed for the task allocation logic consideration
   - title - searching the task by title (it is not regex based, it only returns the doc matching the exact searching term)
   - assignedUser - query runs every time a task is assigned, also used in the fetching the tasks by filtering this field.

3. Task Allocation:
   - taskId -prevents duplicate task allocation
   - assignedUserId - prevents duplicate task allocation



# Project Structure:

src/
  -  config/          # database config
  -  controllers/     # API handlers and business logic
  -  routes/          # API routes and endpoints definition
  -  middlewares/     # middlewares likes authentication, error handling required for all the api endpoints
  -  utils/           # Reusable and helper function logic and input validation functions
  -  app.js
  -  server.js

# COMP404-Backend
This is the backend repository for the COMP 404 Software Engineering course project. It is built using a layered architecture (Controllers, Services, Repositories) and the Factory design pattern.

You can find the frontend Flutter repository [here](https://github.com/Eyad-Mostafa/COMP404-Flutter).

## Tech Stack
* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Neon.tech)
* **ORM:** Prisma
* **API Documentation:** Swagger UI

---

## Getting Started

Follow these steps to set up and run the backend locally.

### 1. Prerequisites
Make sure you have Node.js (version 18 or higher) installed on your machine.

### 2. Clone and Install Dependencies
Clone this repository and install the required npm packages:
```bash
git clone [https://github.com/Eyad-Mostafa/COMP404-Backend](https://github.com/Eyad-Mostafa/COMP404-Backend)
cd COMP404-Backend
npm install
```

### 3. Environment Variables
Create a new file named `.env` in the root of the project. Copy the contents of `.env.example` into it and ask the backend lead for the actual database credentials.

Your `.env` file should look like this:
```env
# The Pooled connection (used by the app logic for efficient serverless connections)
DATABASE_URL="postgresql://user:password@host-pooler.region.aws.neon.tech/neondb?pgbouncer=true&connect_timeout=15"

# The Direct connection (used ONLY for running Prisma database migrations)
DIRECT_URL="postgresql://user:password@host.region.aws.neon.tech/neondb?connect_timeout=15"
```

### 4. Prisma Database Workflow
Because this project uses Prisma, our codebase needs to stay in sync with our database. Please follow these rules carefully so we don't break each other's databases!

**When you pull new code from GitHub:**
If a teammate changed the database, you need to update your local Prisma client. Run:
```bash
npx prisma generate
```

**When YOU want to change the database schema:**
1. Coordinate with the backend lead first so nobody overwrites your work.
2. Update the `prisma/schema.prisma` file.
3. Run the following command to create a migration file and apply it to the database:
```bash
npx prisma migrate dev --name describe_your_change_here
```
*(Warning: If Prisma asks you to "reset" the database because of drift, STOP and ask the team, as this will wipe our shared development data!)*

**To view the database locally:**
You can open a clean UI to view our tables and data by running:
```bash
npx prisma studio
```

### 5. Start the Server
Start the development server using nodemon:
```bash
npm run dev
```
The server will start running on `http://localhost:5000` (or whatever port is defined in your `.env`).

---

## API Documentation
This project uses Swagger for API testing and documentation. 

Once the server is running locally, you can view the documentation and test the endpoints by navigating to:
**`http://localhost:5000/api-docs`**
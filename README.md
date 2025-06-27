# MyMess - Smart Hostel Mess Management System

MyMess is a comprehensive, modern web application designed to streamline hostel mess operations. It provides a seamless interface for students and various administrative roles to manage daily meals, track consumption, handle billing, and facilitate communication.

Built with Next.js and ShadCN UI, MyMess offers a responsive, user-friendly experience on both desktop and mobile devices.

## ✨ Key Features

### 👨‍🎓 Student Portal

- **Dashboard:** View today's meal options and generate a unique, single-use alphanumeric token for meal collection.
- **Verification Workflow:** New student registrations enter a "Pending" state. Access to features is restricted until a hostel admin verifies and approves the account.
- **Hostel Capacity Checks:** Student registration is automatically prevented for hostels that have reached their maximum capacity.
- **Weekly Menu:** Browse the complete meal plan for the week.
- **Meal History:** Track your past meal selections and consumption status.
- **Monthly Summary:** Get an overview of your monthly meal count and estimated bill.
- **Notifications:** Stay updated with important announcements from the mess administration.
- **Bill Management:** View and download your monthly mess bills.
- **Feedback System:** Easily submit feedback and suggestions to the admin.
- **Secure Authentication:** Secure login and signup with Enrollment Number and Course details for admin verification.
- **Personalized Profile:** Update your name and upload a custom avatar.

### 🔑 Admin Portals (Role-Based)

MyMess features a powerful, multi-tiered administrative system with distinct roles and permissions.

#### 🤵 Mess Admin

- **Focused Dashboard:** A simple, streamlined dashboard for verifying student meal tokens at the mess counter.
- **Active Token List:** View a real-time list of all currently active (unconsumed) meal tokens for the day.

#### 🧔‍♂️ Hostel Admin

- **All Mess Admin features.**
- **Student Verification:** View a list of pending student registrations for their hostel and either `Approve` or `Reject` them.
- **Student Roster:** View a detailed list of all `approved` students within their specific hostel.
- **Menu Management:** Dynamically edit the weekly menu.
- **Consumed Meal History:** Access a detailed log of all consumed meals for their hostel.
- **Bill Upload & Notifications:** Upload monthly bills and broadcast announcements to students.
- **Feedback Review:** View all student feedback.
- **Manage Mess Admins:** Create and manage `Mess Admin` accounts for their own hostel.

#### 👑 Super Admin

- **All Hostel Admin features.**
- **System-Wide View:** View and filter students, meal history, and stats across all hostels.
- **Manage Hostel Admins:** The exclusive ability to create and manage `Admin` accounts for different hostels.
- **Aggregated Dashboard:** View system-wide statistics for all students, admins, and hostels.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Authentication:** Custom role-based authentication with JWTs stored in secure, HttpOnly cookies.
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation.
- **Icons:** [Lucide React](https://lucide.dev/)
- **Local Tunneling:** [ngrok](https://ngrok.com/) for exposing the local dev server.

## 🏁 Getting Started

Follow these instructions to set up and run the MyMess project on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or later) and [npm](https://www.npmjs.com/) installed on your system. You will also need a database for Prisma to connect to (e.g., PostgreSQL, MySQL, or a free MongoDB Atlas instance).

### Installation & Setup

1.  **Get the code:**
    Clone the repository or download the source code.

    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    This will also automatically run `prisma generate` to create the Prisma Client types.

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project. Copy the contents of `.env.example` (if it exists) or create it from scratch with the following variables. **Do not commit this file to version control.**

    ```env
    # The connection string for your database.
    # Example for PostgreSQL: DATABASE_URL="postgresql://user:password@host:port/database"
    DATABASE_URL="your-database-connection-string"

    # A secret key for signing JSON Web Tokens (JWTs).
    # Generate a secure random string for this (e.g., using `openssl rand -hex 32` in your terminal).
    JWT_SECRET="your-super-secret-jwt-key"

    # Credentials for the initial Super Admin account that will be created by the seed script.
    SUPERADMIN_EMAIL="superadmin@yourdomain.com"
    SUPERADMIN_PASSWORD="use-a-strong-and-secure-password"

    # The public URL of your application, especially important when using ngrok.
    # Leave this blank for local development without ngrok.
    NEXT_PUBLIC_APP_URL=
    ```

4.  **Push Database Schema:**
    Apply the schema to your database. This command will create the necessary tables/collections.

    ```bash
    npx prisma db push
    ```

5.  **Seed the Database:**
    Run the seed script to create the initial superadmin user (using the credentials from your `.env` file) and populate the default weekly menu.

    ```bash
    npx prisma db seed
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Your application will now be running at [http://localhost:3000](http://localhost:3000).

### Exposing Your Local Server (with ngrok)

This project is integrated with [ngrok](https://ngrok.com/) to easily create a secure, shareable URL for your local development server.

1.  **Create a free ngrok account:**
    Sign up at the [ngrok dashboard](https://dashboard.ngrok.com/signup).

2.  **Get your authtoken:**
    Find your authtoken on your [dashboard's "Your Authtoken" page](https://dashboard.ngrok.com/get-started/your-authtoken).

3.  **Connect your account (one-time setup):**

    ```bash
    npx ngrok config add-authtoken <YOUR_AUTHTOKEN>
    ```

4.  **Expose your server:**
    First, ensure your development server is running (`npm run dev`). Then, in a **separate terminal window**, run:

    ```bash
    npm run expose
    ```

    ngrok will start and display a public URL (e.g., `https://random-string.ngrok-free.app`).

5.  **Update your `.env` file:**
    Copy the public ngrok URL. Open the `.env` file and update the `NEXT_PUBLIC_APP_URL` variable.
    ```env
    NEXT_PUBLIC_APP_URL=https://<your-random-string>.ngrok-free.app
    ```
    **Important:** You may need to restart your main development server (`npm run dev`) for this change to take effect.

### Login Information

- **Super Admin:**
  - Log in using the `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` you defined in your `.env` file.
- **Admin & Mess Admin:**
  - These accounts are created by a Super Admin or a regular Admin via the dashboard.
- **Student:**
  - Create a new student account through the signup page. The account will be `PENDING` until approved by a hostel admin.

## 🛠️ Project Architecture and Implementation Details

### 1. Core Technology Stack

- **Next.js 14 (App Router):** The application is built on the App Router paradigm, utilizing Server Components, Layouts, and file-based routing. Route groups (`(auth)`, `(main)`) organize routes with different layouts.
- **Prisma:** Acts as the ORM to manage interactions with the database, defining the schema for users and their relationships.

### 2. Authentication and Authorization

- **Role-Based System:** The `User` model includes a `role` (`STUDENT`, `MESSADMIN`, `ADMIN`, `SUPERADMIN`) and a `status` (`PENDING`, `APPROVED`, `REJECTED`).
- **JWT Authentication:** User sessions are managed using JSON Web Tokens, which are stored in secure, `HttpOnly` cookies. This prevents common XSS attacks.
- **Protected Routes:** A middleware layer and the main application layout (`src/app/(main)/layout.tsx`) act as security checkpoints. They verify the user's session via an API call and redirect unauthenticated users to `/login`.
- **Student Verification Flow:**
  1.  A new user signs up. A capacity check is performed on their selected hostel.
  2.  If space is available, the user is created with a `PENDING` status.
  3.  The student can log in but will only see a status page indicating their registration is under review.
  4.  The relevant hostel Admin sees this pending request on their "Verify Students" page.
  5.  The Admin can `Approve` or `Reject` the request.
  6.  Once `APPROVED`, the student gains full access to the student portal on their next visit.

### 3. Data Management

The application uses a hybrid approach for data management:

- **Database (via Prisma):** All `User` data is stored in a persistent database. This is the "single source of truth" for all user and authentication-related information.
- **`localStorage` (Simulated Data):** To simplify development and focus on UI/UX, other data like meal selections, notifications, bills, and feedback are managed on the client-side and persisted in the browser's `localStorage`. In a full production application, these would also be migrated to the database.

### 4. Responsive Design

- **`useIsMobile` Hook:** A custom hook detects if the user is on a mobile-sized screen, allowing components to adapt their layout.
- **Adaptive Components:** Many pages switch between a table view on desktops to a more readable card-based layout on mobile screens. The main navigation sidebar also collapses on desktop and becomes a slide-out sheet on mobile.

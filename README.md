# MyMess - Smart Hostel Mess Management System

## 1. Project Overview

MyMess is a comprehensive, full-stack web application designed to modernize and streamline hostel mess operations. It digitizes the entire workflow, from meal selection and token generation for students to user verification, menu management, and analytics for administrators.

The system is built on a robust role-based access control (RBAC) model, providing tailored experiences and permissions for four distinct roles:

- **Students:** The primary users who interact with the system for their daily meals.
- **Mess Admins:** Staff responsible for day-to-day mess operations, primarily token verification.
- **Admins:** Hostel-specific administrators who manage students, staff, and hostel-level settings.
- **Super Admin:** The system-wide administrator with complete oversight and control over all hostels and users.

This application is built to be responsive, secure, and user-friendly, offering a seamless experience on both desktop and mobile devices.

---

## 2. Core Features

### 👨‍🎓 For Students

- **Secure Authentication:** JWT-based login and session management.
- **Dashboard:** A central hub to select daily meals (Breakfast, Lunch, Dinner).
- **Quantity Selection:** Choose the number of meals required before generating a token.
- **Add-on Selection:** Add extra items like curd or sweets to a meal selection.
- **Unique Token Generation:** Instantly get a unique, single-use token for meal and add-on collection.
- **Meal History:** View a complete log of all past meal selections and their consumption status.
- **Monthly Summary:** Track total meals and add-ons consumed and see an estimated monthly bill.
- **Notifications:** Receive important announcements from administrators.
- **Feedback Submission:** Send feedback or suggestions directly to the administration.

### 🍽️ For Mess Admins

- **Secure Login:** Role-specific access to the mess admin dashboard.
- **Token Verification:** A simple interface to enter a student's token and verify their meal.
- **Order Details:** View meal quantity and any selected add-ons upon token verification.
- **Active Token Overview:** See a live list of all active, unconsumed tokens for the current day.
- **Menu Management:** Update the weekly meal plan, including item names and availability.
- **Add-on Management:** Add, edit, or remove extra items available for purchase.
- **Broadcast Notifications:** Send announcements to all students.

### 🛡️ For Admins (Hostel-Specific)

- **Admin Dashboard:** An overview of the specific hostel's statistics.
- **Student Verification:** Approve or reject new student registrations for their assigned hostel.
- **Student Management:** View a detailed list of all approved students in the hostel.
- **Mess Admin Management:** Create and manage mess admin accounts for their assigned hostel.
- **Billing:** Upload monthly bill statements for students.
- **Analytics:** View consumption trends and data specific to their hostel.
- **View Feedback:** Review all feedback submitted by students.

### 👑 For Super Admins

- **Global Dashboard:** A system-wide overview of all students, admins, and hostels.
- **Admin Management:** Create, view, and delete Admin accounts for all hostels.
- **Full User Management:** Has all the capabilities of a regular Admin, but across all hostels.
- **System-wide Analytics:** Access and filter analytics data for any or all hostels.
- **Full Menu & Add-on Control:** Complete control over the master menu and add-on list.

---

## 3. System Architecture & Tech Stack

MyMess is built using a modern, robust, and type-safe technology stack, prioritizing developer experience and performance.

### Architecture

- **Monorepo Structure:** The frontend and backend are colocated within a single Next.js project.
- **Server-Side Rendering (SSR):** Leverages Next.js with the App Router for fast initial page loads and improved SEO. Server Components are used by default to minimize client-side JavaScript.
- **RESTful API:** The backend is exposed via API Routes within Next.js, handling all data mutations and business logic.
- **Component-Based UI:** The frontend is built with reusable React components, ensuring a consistent and maintainable user interface.
- **Centralized State Management:** Client-side state is managed via React's Context API, providing a clean way to handle authentication (`AuthProvider`) and application data (`DataProvider`).

### Technology Details

| Technology / Library   | Version   | Purpose                                                               |
| :--------------------- | :-------- | :-------------------------------------------------------------------- |
| **Next.js**            | `15.3.3`  | Full-stack React framework with App Router, SSR, and API routes.      |
| **React**              | `18.3.1`  | Core library for building the user interface.                         |
| **TypeScript**         | `5`       | Provides static typing for robust and error-free code.                |
| **Prisma**             | `5.17.0`  | Next-generation ORM for type-safe database access (MongoDB).          |
| **MongoDB**            | -         | NoSQL database used for flexible and scalable data storage.           |
| **Tailwind CSS**       | `3.4.1`   | A utility-first CSS framework for rapid UI development.               |
| **ShadCN UI**          | -         | A collection of beautifully designed, accessible UI components.       |
| **Lucide React**       | `0.475.0` | Provides a comprehensive set of clean and consistent icons.           |
| **React Hook Form**    | `7.54.2`  | Manages complex forms with efficient validation.                      |
| **Zod**                | `3.24.2`  | Schema declaration and validation library, used with React Hook Form. |
| **JWT (jsonwebtoken)** | `9.0.2`   | Used for creating secure authentication tokens.                       |
| **Bcrypt.js**          | `2.4.3`   | Hashes user passwords for secure storage.                             |
| **Nodemailer**         | `6.9.14`  | Sends transactional emails for password resets and notifications.     |
| **Recharts**           | `2.15.1`  | A composable charting library for data visualization.                 |

---

## 4. Database Schema

The data is modeled in `prisma/schema.prisma` and consists of the following main entities:

- `User`: Stores user information, including their role, status, and credentials.
- `MenuItem`: Defines the weekly menu, with an entry for each meal type on each day.
- `MealSelection`: Records each time a student generates a token for a meal, including quantity.
- `Addon`: Defines the extra items available for purchase.
- `AddonConsumption`: Links a `MealSelection` to any `Addon`s purchased with it.
- `Bill`: Stores metadata about uploaded monthly bill files.
- `Feedback`: Stores feedback submitted by students.
- `Notification`: Stores announcements created by administrators.

---

## 5. Getting Started

Follow these instructions to set up and run the MyMess project on your local machine.

### Prerequisites

- **Node.js:** v18 or later
- **npm/yarn/pnpm:** Package manager
- **MongoDB:** A running MongoDB instance (e.g., from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))
- **SMTP Provider:** An email service for sending emails (e.g., Gmail, SendGrid)

### Installation & Setup

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd MyMess
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project and add the following variables.

    ```env
    # 1. DATABASE_URL
    # Connection string for your MongoDB database.
    # Example: DATABASE_URL="mongodb+srv://user:<password>@cluster.mongodb.net/mymessdb?retryWrites=true&w=majority"
    DATABASE_URL="your-mongodb-connection-string"

    # 2. JWT Secrets
    # Generate TWO DIFFERENT secure random strings (e.g., `openssl rand -hex 32` in your terminal).
    # JWT_SECRET is for user sessions.
    # JWT_RESET_SECRET is for the short-lived password reset tokens.
    JWT_SECRET="your-super-secret-jwt-key"
    JWT_RESET_SECRET="your-different-super-secret-jwt-reset-key"

    # 3. Super Admin Credentials
    # Credentials for the initial Super Admin account created by the seed script.
    SUPERADMIN_EMAIL="superadmin@yourdomain.com"
    SUPERADMIN_PASSWORD="a-very-strong-and-secure-password"

    # 4. SMTP Configuration (for sending emails)
    # Use a service like Gmail (requires an "App Password"), SendGrid, etc.
    SMTP_HOST="smtp.example.com"
    SMTP_PORT="587"
    SMTP_USER="your-smtp-username"
    SMTP_PASS="your-smtp-password"
    SMTP_SECURE="false" # 'true' for port 465, 'false' for 587 (STARTTLS)
    SMTP_FROM_ADDRESS="no-reply@yourdomain.com" # The email address that sends the emails
    SMTP_FROM_NAME="MyMess" # The display name for the sender

    # 5. Application Base URL
    # Used for generating links in emails (e.g., password reset).
    # For local development, this is http://localhost:3000
    APP_BASE_URL="http://localhost:3000"
    ```

4.  **Seed the Database:**
    Run the seed script to create the initial superadmin user and the default weekly menu.

    ```bash
    npx prisma db seed
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Your application will be running at [http://localhost:3000](http://localhost:3000).

---

## 6. Login Information

- **Super Admin:**
  - Log in using the `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` you defined in your `.env` file.
- **Admin & Mess Admin:**
  - These accounts are created by a Super Admin or a regular Admin via their respective dashboards.
- **Student:**
  - Create a new student account through the signup page. The account will be `PENDING` until approved by a hostel admin.

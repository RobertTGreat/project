# DEVTOOLs - Software Development Project

https://rrobertson.tech

## 1. Project Overview

This project is a [briefly describe what your application does, e.g., "web application for managing tool usage and favorites"] developed using Next.js, TypeScript, Tailwind CSS, and Supabase for backend services.

This README provides instructions for running the project locally, primarily for testing and evaluation purposes. It assumes you have already obtained the project files and that the Supabase environment variables are pre-configured in a `.env.local` file.

## 2. Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js:**
    *   This project requires Node.js. We recommend using the latest LTS (Long Term Support) version.
    *   You can download it from [https://nodejs.org/](https://nodejs.org/).
    *   To check your version, run: `node -v`
*   **Package Manager (npm or Yarn):**
    *   npm is included with Node.js. To check your version: `npm -v`
    *   Alternatively, you can use Yarn: `yarn --version` (Install from [https://yarnpkg.com/](https://yarnpkg.com/) if not present).
    *   This guide will primarily use `npm` commands, but `yarn` equivalents are similar (e.g., `npm install` is `yarn install`, `npm run dev` is `yarn dev`).

## 3. Getting Started

### 3.1. Install Dependencies

1.  Open your terminal or command prompt.
2.  Navigate to the root directory of the project files.
3.  Install the necessary Node.js packages by running:

    ```bash
    npm install
    ```
    Or, if you are using Yarn:
    ```bash
    yarn install
    ```

## 4. Running the Application

### 4.1. Start the Development Server

Once dependencies are installed, you can start the Next.js development server:

1.  Ensure you are in the project's root directory in your terminal.
2.  Run the command:

    ```bash
    npm run dev
    ```
    Or, with Yarn:
    ```bash
    yarn dev
    ```
This will typically start the application on `http://localhost:3000`. Open this URL in your web browser to view the application.

## 5. Supabase Backend Access & Information

*   The application connects to a Supabase instance for its backend services (database, authentication, etc.). The necessary Supabase URL and keys are pre-configured in the `.env.local` file.
*   **Viewing the Supabase Project Backend:**
    *   Due to the presence of sensitive data and for security purposes, direct access credentials or detailed schema information for the Supabase project are not provided in this.
    *   If you require a demonstration of the backend, need to view specific table structures, or have queries about the Supabase setup, please contact **Robert Robertson at Robert.robertsonid@gmail.com or 20315551@myclyde.ac.uk**. I would be happy to arrange a walkthrough or provide necessary information in a secure manner.

## 6. Troubleshooting / Notes

*   **Node.js Version:** If you encounter issues, ensure your Node.js version is compatible (LTS recommended).
*   **Supabase Connection Issues (if `.env.local` is somehow incorrect or service is down):**
    *   Verify the `.env.local` file exists in the root of the project and contains the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    *   Ensure the Supabase project associated with these keys is active.

---

If you encounter any issues running the project, please refer to the error messages in the console or contact [Your Name/Email Address].

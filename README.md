# PromptStudio 🚀

**PromptStudio** is a next-generation AI-powered development environment that bridges the gap between natural language prompts and executable full-stack applications. By orchestrating autonomous AI agents with secure cloud sandboxes, it allows developers to generate, preview, and iterate on React applications in real-time.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-teal)
![Inngest](https://img.shields.io/badge/Orchestration-Inngest-darkblue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## 💡 Overview

PromptStudio is not just a code generator. It is a **live execution environment** built to make AI-assisted application development more structured, reproducible, and developer-friendly. It leverages **E2B Code Interpreters** to spin up isolated sandboxes where generated code is actually run and rendered. Complex AI workflows including planning, coding, and summarizing are managed durably via **Inngest**, ensuring reliability even during long-running tasks.

## ✨ Key Features

* **🤖 Autonomous Coding Agents**: Uses the Inngest Agent Kit to deploy specific agents for coding, terminal execution, and file management.
* **📦 Secure Cloud Sandboxing**: Instantly provisions **E2B** sandboxes (`prompt-studio-nextjs-template`) to execute and test untrusted code in isolation.
* **⚡ Real-Time Preview**: Renders generated React components directly in the browser via a live sandbox URL.
* **🔄 Durable Workflows**: "Agentic" workflows are event-driven and state-managed, capable of recovering from failures and managing long context windows.
* **🗄️ Project & History Management**: Complete chat history and code fragment versioning backed by PostgreSQL.
* **🔐 Enterprise-Grade Auth**: Secure authentication and user management provided by **Clerk**.

## 🛠 Tech Stack

### Frontend & Core
* **Framework**: Next.js 16 (App Router)
* **UI Library**: React 19
* **Styling**: Tailwind CSS v4, Radix UI, Lucide React
* **State**: TanStack Query

### Backend & Infrastructure
* **Database**: PostgreSQL (via Prisma ORM)
* **Authentication**: Clerk
* **AI Orchestration**: Inngest
* **Sandboxing**: E2B Code Interpreter
* **AI SDK**: Vercel AI SDK

## 🏗 Architecture

The system is built on an event-driven architecture defined in `src/inngest/function.js`:

1. **Event Trigger**: A user prompt triggers the `code-agent/run` event.
2. **Context Loading**: The workflow fetches historical messages from the `Message` table to maintain conversation context.
3. **Sandbox Initialization**: An E2B sandbox is created to serve as the runtime environment.
4. **Agent Execution Loop**:
   * **Coding Agent**: Writes code and executes terminal commands.
   * **Tool Use**: Utilizes custom tools like `createOrUpdateFiles`, `readFiles`, and `terminal` to manipulate the sandbox.
5. **Result Capture**: Generated code fragments and the live sandbox URL are stored in the `Fragment` table.

## 🗄 Database Schema

* **User**: Stores identity and links to Clerk.
* **Project**: Groups related conversations and code fragments.
* **Message**: Stores the chat history (User or Assistant) and links to code results.
* **Fragment**: Represents a specific version of generated code, linked to a sandbox URL.

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* PostgreSQL (or Docker to run it locally)
* Keys for: Clerk, E2B, OpenAI or Gemini

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/HarshilModh/promptStudio.git
   cd promptStudio
   ```
   
2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    Create a .env file using .env.example as a reference and configure values such as DATABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,                CLERK_SECRET_KEY, E2B_API_KEY, and INNGEST_SIGNING_KEY.

4.  **Run Migrations**
    ```bash
    npx prisma migrate dev
    ```

5.  **Start Development Servers**
    You need to run both the Next.js app and the Inngest Dev Server.

    **Terminal 1: Start App & Database**
    ```bash
    npm run dev
    ```
    *(This runs `docker compose up -d && next dev`)*

    **Terminal 2: Start Inngest Dev Server**
    ```bash
    npx inngest-cli@latest dev
    ```
    * Open [http://localhost:3000](http://localhost:3000) to view the app.
    * Open [http://localhost:8288](http://localhost:8288) to view the Inngest dashboard.

🤝 Contributing

Contributions are welcome. If you want to improve setup, developer experience, documentation, or core workflows, please review       CONTRIBUTING.md before opening a pull request.

📄 License

This project is licensed under the MIT License.

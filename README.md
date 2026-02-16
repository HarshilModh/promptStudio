# Prompt Studio 🚀

**Prompt Studio** is a cutting-edge, AI-powered full-stack application builder that empowers users to generate fully functional Next.js applications through natural language interactions. By leveraging advanced LLMs and a secure sandboxed environment, it bridges the gap between idea and implementation, offering real-time code generation and live previews.

---

## 🛠️ Tech Stack

Built with the latest web technologies to ensure performance, scalability, and developer experience:

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Turbo)
-   **Language:** [TypeScript](https://www.typescriptlang.org/) / JavaScript
-   **AI & Agents:** [Vercel AI SDK](https://sdk.vercel.ai/docs), Custom Multi-Agent System
-   **Sandboxing:** [e2b](https://e2b.dev/) (Code Interpreter & Sandboxed Execution)
-   **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
-   **Authentication:** [Clerk](https://clerk.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
-   **State Management:** React Query (TanStack Query)
-   **Background Jobs:** [Inngest](https://www.inngest.com/)

---

## ✨ Key Features

### 🤖 AI-Driven Development
-   **Chat-to-App Interface:** Interact with an intelligent agent to describe your application requirements.
-   **Multi-Agent Architecture:** Utilizes specialized agents for planning, coding, and summarizing tasks to ensure high-quality output.
-   **Context-Aware Generation:** Understands project context to make relevant code modifications.

### ⚡ Real-Time Preview & Sandboxing
-   **Live Code Rendering:** Instantly view the generated React components and applications in a secure, isolated sandbox.
-   **Secure Execution:** Code is executed in a controlled environment to prevent security risks.

### 📦 Project Management
-   **Workspace Organization:** Manage multiple projects with ease.
-   **History & Versioning:** Track changes and revert to previous iterations of your generated apps.

### 🔐 Enterprise-Grade Basics
-   **Secure Authentication:** Robust user management via Clerk.
-   **Usage Tracking:** Credit-based system to manage API usage and resource consumption.

---

## 🚀 Getting Started

Follow these steps to set up the project locally for review:

### Prerequisites

-   Node.js (v18+)
-   Docker (for local PostgreSQL database)
-   npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/promptstudio.git
    cd promptstudio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and configure the necessary keys (Clerk, Database URL, OpenAI/Anthropic API keys, etc.).
    ```bash
    cp .env.example .env
    ```

4.  **Initialize the Database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

-   `src/app`: Next.js App Router structure.
-   `src/components`: Reusable UI components (Shadcn + Custom).
-   `src/modules`: Domain-driven feature modules (Home, Projects, Auth, etc.).
-   `src/lib`: Utility functions and shared logic.
-   `prisma`: Database schema and migrations.

---

## 🤝 Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

---

*This project is a demonstration of modern AI engineering capabilities, integrating complex state management, real-time streaming, and sandboxed code execution.*

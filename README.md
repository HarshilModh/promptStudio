# ⚡ PromptStudio | AI-Powered Generative UI Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)
![E2B](https://img.shields.io/badge/Sandboxing-E2B-orange?style=for-the-badge)
![Inngest](https://img.shields.io/badge/Orchestration-Inngest-000000?style=for-the-badge)

> **"A v0.dev clone that turns natural language into full-stack, multi-file React applications."**

PromptStudio is an autonomous AI coding platform. Unlike standard code generators, it utilizes an **agentic loop** to plan, generate, execute, and self-correct code in real-time. It leverages **E2B micro-VMs** to safely execute untrusted AI-generated code in the cloud, providing users with instant, live previews of their applications.

---

## 🎥 Demo

![Project Screenshot](https://via.placeholder.com/800x450?text=Insert+GIF+or+Screenshot+Here)
*(Add a link to your live demo or a GIF here)*

---

## 🏗️ System Architecture

PromptStudio solves the challenge of **"safe remote code execution"** by combining LLM reasoning with isolated sandboxes.

1.  **Prompt Analysis:** The user's prompt is sent to **Google Gemini**, which acts as the Reasoning Engine to plan the file structure.
2.  **Agentic Workflow:** **Inngest** orchestrates the multi-step generation process, handling retries and long-running jobs (preventing server timeouts).
3.  **Code Generation:** The agent writes the code (React/Tailwind) and dependency definitions.
4.  **Secure Sandboxing:** The code is sent to **E2B**, which spins up a transient Linux micro-VM.
5.  **Execution & Preview:** The VM installs dependencies, starts the dev server, and tunnels the port back to the user's browser for a live preview.



---

## 🚀 Key Features

-   **🤖 Autonomous Coding Agent:** Capable of writing multi-file applications, adding components (shadcn/ui), and fixing runtime errors automatically.
-   **🔒 Secure Cloud Sandboxing:** Uses E2B to execute code in isolated environments, ensuring the host server is never exposed to malicious code.
-   **⚡ Live Preview Tunneling:** Real-time bi-directional sync between the generated code and the preview window.
-   **🔄 Version Control:** Built-in history and rollback features powered by PostgreSQL and Prisma.
-   **💎 Monetization Ready:** Integrated Clerk Auth and credit system for Free vs. Pro tiers.

---

## 🛠️ Tech Stack

-   **Framework:** Next.js 15 (App Router, Server Actions)
-   **Language:** TypeScript
-   **AI Model:** Google Gemini 1.5 Pro
-   **Orchestration:** Inngest (Event-driven workflows)
-   **Sandboxing:** E2B (Code Interpreter SDK)
-   **Database:** PostgreSQL (via Supabase/Neon)
-   **ORM:** Prisma
-   **Styling:** Tailwind CSS, shadcn/ui
-   **Auth:** Clerk

---

## 💻 Getting Started

### Prerequisites

-   Node.js 18+
-   PostgreSQL Database
-   E2B Account & API Key
-   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/HarshilModh/PromptStudio.git](https://github.com/HarshilModh/PromptStudio.git)
    cd PromptStudio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
    CLERK_SECRET_KEY="..."
    GEMINI_API_KEY="..."
    E2B_ACCESS_TOKEN="..."
    ```

4.  **Push Database Schema**
    ```bash
    npx prisma db push
    ```

5.  **Run the development server**
    ```bash
    npm run dev
    ```

6.  **Start Inngest Local Dev Server** (in a separate terminal)
    ```bash
    npx inngest-cli@latest dev
    ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📬 Contact

**Harshil Modh** -   [LinkedIn](https://linkedin.com/in/harshil-modh-53a62a1a6)
-   [Portfolio](https://portfolio-three-blue-33.vercel.app/)
-   Email: hmodh@stevens.edu

---

*Starred this repo? ⭐ Consider following me on GitHub!*

# 🔗 S3Manager

A modern, high-performance AWS S3 bucket management interface built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. This application provides a streamlined, dark-mode dashboard for managing cloud storage objects with ease.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)

## ✨ Key Features

* **Secure Authentication**: Connect using AWS IAM credentials (Access Key & Secret Key) stored securely via browser cookies.
* **Intuitive File Explorer**: Browse through S3 buckets with a familiar hierarchical folder and file structure.
* **Drag-and-Drop Uploads**: Support for bulk file uploads via a dedicated drop zone or file browser.
* **Real-time Progress**: Monitor active uploads with a status-tracking progress bar.
* **Resource Management**: Create new directories and delete existing objects directly from the web interface.
* **Responsive Dark UI**: A sleek, high-contrast interface optimized for developers.

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
* **Frontend**: [React 19](https://react.dev/) with TypeScript
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **Cloud Integration**: [AWS SDK for JavaScript v2](https://aws.amazon.com/sdk-for-javascript/)
* **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

* Node.js 20.x or later
* An AWS account with an S3 bucket and IAM credentials

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/vijay-talsangi/s3manager.git](https://github.com/vijay-talsangi/s3manager.git)
    cd s3manager
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Access the application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1.  **Connect**: Enter your `Access Key ID`, `Secret Access Key`, `Region`, and `Bucket Name` on the connection screen.
2.  **Navigate**: Click on folder icons to enter directories or use the "Back" button to go up a level.
3.  **Upload**: Drag files onto the dashboard or click "Upload Files" to select from your local machine.
4.  **Organize**: Use the "New Folder" button to create virtual directories within your bucket.
5.  **Clean up**: Click the trash icon to permanently remove objects from S3.

## 📂 Project Structure

* `src/app/`: Next.js App Router pages and API routes.
* `src/components/`: Reusable React UI components like `FileManager` and `S3Connection`.
* `src/lib/`: Core logic for S3 client initialization and cookie handling.
* `src/types/`: TypeScript interface definitions.

## 🔒 Security

This application stores your AWS credentials in local cookies (`js-cookie`) to maintain your session. Always use this application over a trusted network and ensure your IAM user has the minimum required permissions (Least Privilege) for the target S3 bucket.

---
*Created with Next.js and Tailwind CSS.*

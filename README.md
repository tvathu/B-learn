# Blearn 🎓

A modern, premium Learning Management System (LMS) designed with a beautiful, dynamic glassmorphism UI. 

**Live Demo:** [https://tvathu.github.io/B-learn/](https://tvathu.github.io/B-learn/)

## 🚀 Features

- **Dual Portals:** Separate, customized experiences and layouts for **Students** and **Teachers**.
- **Mock Authentication:** Fully functional frontend login/registration flow with role-based routing (Student Space vs. Teacher Portal).
- **Interactive Dashboard:** Premium UI featuring floating cards, animated gradients, and responsive sidebars.
- **Course & Quiz Systems:** View enrolled courses, track quiz scores, and manage educational content.

## 🛠️ Tech Stack & Implementation Details

- **Frontend Framework:** Built with [React 19](https://react.dev/) and initialized via [Vite](https://vitejs.dev/) for lightning-fast development.
- **Styling:** Styled using the brand-new [Tailwind CSS v4](https://tailwindcss.com/) directly through CSS variables for maximum flexibility.
- **Routing:** Managed via `react-router-dom` to ensure seamless transitions between the Auth pages and the Dashboard without refreshing.
- **State Management:** Handled natively using React's **Context API** (`AuthContext` and `CourseContext`) synced locally to `localStorage` for data persistence.
- **Icons:** Beautiful, scalable SVG icons provided by [Lucide React](https://lucide.dev/).

## 💻 How to Run Locally

1. Clone the repository to your local machine.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 🌐 How to Deploy

This project is configured to deploy to **GitHub Pages**. 

To deploy future updates, simply make your changes, commit them, and run:
```bash
npm run deploy
```
This will automatically build the production files and push them to the `gh-pages` branch.

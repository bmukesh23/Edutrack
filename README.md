# 🎓 Edutrack
An AI-based Learning Management System (LMS) that adapts to each user’s skill level and learning pace, ensuring a customized and effective learning experience. Built with React.ts, Spring Boot and Gemini Flash 2.5.

## 📦 Technologies

- `React`
- `Typescript`
- `Tailwind CSS`
- `Spring Boot`
- `PostgreSQL`

## ✨ Features

- **AI-Generated Learning Paths:** Based on initial assessments to personalize learning.  

- **Personalized Topic Recommendations:** Focus on strengthening weak areas.  

- **Ask AI Feature:** Get instant answers to coding & learning queries.  

- **Real-Time Progress Tracking:** Monitor performance with detailed analytics.  

- **User Authentication:** Users can securely sign in and access notes with Firebase Auth integrated with JWT.

## 🚦Running the project

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): Make sure to install Node.js, which includes npm (Node Package Manager).

## Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/bmukesh23/Edutrack.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd Edutrack
    ```

3. **Install Dependencies:**
    ```bash
    cd client
    npm install
    ```

4. **Set Environment Variables:**
    1. Create a `.env` file in the root of the `client` folder of the project.
    2. Add the following environment variables and replace the values with your own:

    ```env
    VITE_FB_API_KEY=
    VITE_FB_AUTH=
    VITE_FB_PROJECT=
    VITE_FB_STORAGE=
    VITE_FB_MESSAGING=
    VITE_FB_APP=
    VITE_FB_MEASUREMENT=
    VITE_BACKEND_URL=
    ```

5. **Run the application:**
    ```bash
    cd client
    npm run dev
    ```

6. **Access the App:**
- By default, the frontend will be available at [http://localhost:5173](http://localhost:5173)

- Once both servers are running:
  Open your web browser and go to [http://localhost:5173](http://localhost:5173) and Ensure the backend is accessible.
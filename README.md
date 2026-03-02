# 🚀 AI Code Reviewer (Full-Stack | Powered by Gemini)

> Write code. Send to backend. Get structured AI feedback.

A full-stack AI-powered code review platform that analyzes user code and returns structured improvement suggestions using Google Gemini API.

---

## 🧠 Core Idea

Instead of just running code, this tool:

- Analyzes structure  
- Identifies bad practices  
- Suggests improvements  
- Flags potential issues  

**Focus = learning, not execution.**

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React  
- Vite  
- CSS  

### 🚀 Backend
- Node.js  
- Express  

### 🤖 AI
- Google Gemini API  

---

## 🏗️ Architecture

```
Frontend → Backend API → Gemini → Backend → Frontend
```

### Why Backend?

- API key protection  
- Rate limiting control  
- Prompt customization  
- Security  

Calling Gemini directly from frontend is insecure.

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/subh4deep/AI-CODE-REVIEW.git
cd AI-CODE-REVIEW
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend` folder:

```env
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
npx nodemon server.js
```

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend` folder:

```env
VITE_API_URL=your_vite_api_url_here
```

Run frontend:

```bash
npm run dev
```

---

## 🔌 API Endpoint

### POST `/ai/get-review`

### Request Body

```json
{
  "code": "console.log('Hello World')"
}
```

### Response

```json
"AI generated review text here..."
```

---

## 🔐 Security Considerations

- API key stored in backend only  
- Environment variables used  
- No direct client-side AI calls  

If configured properly → safe.  
If misconfigured → API key leak guaranteed.

---

## 📈 Future Improvements

- Code execution sandbox  
- Authentication system  
- Review history  
- Code quality scoring  
- CI/CD deployment  

---

## 🌍 Deployment Options

- Frontend → Render  
- Backend → Render

---
### Live Demo


https://ai-code-review-frontend-rx94.onrender.com/


---

## 👨‍💻 Author


Subhadeep Bera  
- Full-Stack Developer | AI Enthusiast  
- Focused on building intelligent developer tools.

Built as a practical full-stack AI learning project.

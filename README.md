# 🚀 VectorShift Demo: DAG Pipeline Builder

🔴 **Live Demo (Vercel):**  
https://vector-shift-demo-wfxe-bkxmht6ol-rupeshs-projects-54aeef93.vercel.app/

🎥 **Video Walkthrough:**  
https://drive.google.com/file/d/1hUE4OfN2aKL_eXyWO7k6XLdXjg-fHYG3/view?usp=sharing

---

## 📌 Overview

This project is a Full Stack application featuring:

- A React frontend for building drag-and-drop node-based pipelines  
- A FastAPI backend for parsing and validating Directed Acyclic Graphs (DAGs)

Users can visually construct pipelines and verify whether the structure forms a valid DAG.

---

## 📁 Project Resources

- 🌐 **Live Deployment:**  
  https://vector-shift-demo-wfxe-bkxmht6ol-rupeshs-projects-54aeef93.vercel.app/

- 🎬 **Video Demonstration:**  
  https://drive.google.com/file/d/1hUE4OfN2aKL_eXyWO7k6XLdXjg-fHYG3/view?usp=sharing

- 📂 **Source Code (Drive Folder):**  
  https://drive.google.com/drive/folders/1L_ucy9d7znEaw17GfnZ9sCwhjX7Ik2Sp?usp=sharing

- 📦 **Source Code (ZIP):**  
  https://drive.google.com/file/d/1imBzw5WmZCd5QyF4wfKNMFHKSxpqZVT4/view?usp=drive_link

- 💻 **GitHub Repository:**  
  https://github.com/Rupesh-klr/vectorShift-demo

---

# 🛠️ Tech Stack & Key Features

## 🎨 Frontend  
**React • React Flow • Zustand**

### 🔹 Interactive Canvas
- Drag-and-drop pipeline builder using `reactflow`
- Smooth zooming and panning

### 🔹 Dynamic Node Architecture
- Modular `BaseNode` abstraction
- Supports:
  - Input Nodes
  - Output Nodes
  - LLM Nodes
  - Text Nodes
- Collapsible states with responsive UI rendering

### 🔹 Variable Autocomplete System
- Parses `{{variables}}` dynamically using Regex
- Automatically generates connection handles
- Dropdown suggestions to auto-link nodes on canvas

### 🔹 Advanced State Management
- Zustand-powered global store
- Undo / Redo support
- Local storage persistence

### 🔹 Custom Edge Routing
- SVG-based custom edges
- Hover glow effects
- Double-click edge deletion
- Maintains node collapse states safely

---

## ⚙️ Backend  
**Python • FastAPI**

### 🔹 DAG Processing
- REST API endpoint receives node/edge JSON data
- Processes topological graph structure

### 🔹 Graph Validation & Metrics
- Calculates:
  - Total nodes
  - Total edges
- Verifies if graph is a valid Directed Acyclic Graph (`is_dag`)

---

# 🚀 Local Setup & Installation

Follow the steps below to run locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Rupesh-klr/vectorShift-demo.git
cd vectorShift-demo
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 3️⃣ Backend Setup

```bash
cd backend
python3 -m venv venv
```

### Activate virtual environment

**macOS / Linux**
```bash
source venv/bin/activate
```

**Windows**
```bash
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

If adding new packages:

```bash
pip install fastapi "uvicorn[standard]" python-multipart
pip freeze > requirements.txt
```

---

## 4️⃣ Run Backend Server

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

# 📦 Production Deployment

For platforms like Render or Heroku:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

# ✨ Highlights

- Modular frontend architecture  
- Advanced React state management  
- Graph theory implementation (DAG validation)  
- Full stack integration  
- Production deployment ready  
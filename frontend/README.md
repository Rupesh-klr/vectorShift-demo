# 🚀 VectorShift — DAG Pipeline Builder

<p align="center">
  <b>Visual Node-Based Pipeline Builder with DAG Validation</b><br/>
  Full Stack • React Flow • FastAPI • Graph Theory
</p>

<p align="center">
  <a href="https://vector-shift-demo-wfxe-bkxmht6ol-rupeshs-projects-54aeef93.vercel.app/">
    <img src="https://img.shields.io/badge/Live-Demo-green?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/State-Zustand-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Graph-DAG%20Validated-orange?style=for-the-badge" />
</p>

---

## 🔴 Live Demo

🌐 **Application:**  
https://vector-shift-demo-wfxe-bkxmht6ol-rupeshs-projects-54aeef93.vercel.app/

🎥 **Video Walkthrough:**  
https://drive.google.com/file/d/1hUE4OfN2aKL_eXyWO7k6XLdXjg-fHYG3/view?usp=sharing

---

# 📌 Overview

VectorShift is a **visual DAG pipeline builder** that allows users to:

- Drag and drop modular nodes
- Dynamically connect pipelines
- Auto-generate variable handles
- Validate graph structure mathematically
- Detect whether the pipeline forms a valid Directed Acyclic Graph (DAG)

This project demonstrates strong skills in:

- Frontend architecture design  
- Advanced state management  
- Graph theory implementation  
- Full stack system integration  

---

# 🧠 System Architecture

```
        ┌────────────────────┐
        │    React Frontend  │
        │  (React Flow UI)   │
        └──────────┬─────────┘
                   │
                   │ JSON (Nodes + Edges)
                   ▼
        ┌────────────────────┐
        │   FastAPI Backend  │
        │  DAG Verification  │
        └──────────┬─────────┘
                   │
                   ▼
        ┌────────────────────┐
        │  Graph Metrics     │
        │  - Node Count      │
        │  - Edge Count      │
        │  - is_dag Boolean  │
        └────────────────────┘
```

### 🔄 Data Flow
1. User builds pipeline visually  
2. Frontend serializes nodes + edges  
3. Backend validates graph structure  
4. API returns computed metrics  

---

# 🛠 Tech Stack

## 🎨 Frontend
- React
- React Flow
- Zustand
- Custom SVG Edges
- Regex-based Variable Parser

### Key Frontend Features

- Drag-and-drop interactive canvas  
- Modular `BaseNode` abstraction  
- Collapsible nodes  
- Dynamic `{{variable}}` detection  
- Auto-generated connection handles  
- Undo / Redo (time travel state)  
- Local storage persistence  
- Inline edge deletion  
- Custom glow edge effects  

---

## ⚙️ Backend

- Python
- FastAPI
- Uvicorn

### Backend Responsibilities

- Receive graph JSON payload  
- Compute:
  - Total nodes
  - Total edges
  - DAG validation (`is_dag`)  
- Return structured API response  

---

# 📡 API Documentation

## POST `/parse`

Validates graph structure and returns DAG metrics.

### Request Body

```json
{
  "nodes": [
    { "id": "1", "type": "input" },
    { "id": "2", "type": "llm" }
  ],
  "edges": [
    { "source": "1", "target": "2" }
  ]
}
```

### Response

```json
{
  "node_count": 2,
  "edge_count": 1,
  "is_dag": true
}
```

### Response Fields

| Field        | Type    | Description |
|--------------|---------|------------|
| node_count   | number  | Total number of nodes |
| edge_count   | number  | Total number of edges |
| is_dag       | boolean | Whether graph forms a valid DAG |

---

# 🚀 Local Development Setup

## 1️⃣ Clone Repository

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

Runs at:

```
http://localhost:3000
```

---

## 3️⃣ Backend Setup

```bash
cd backend
python3 -m venv venv
```

Activate environment:

**macOS / Linux**
```bash
source venv/bin/activate
```

**Windows**
```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

# 📦 Production Deployment

For Render / Heroku:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

# ✨ Engineering Highlights

- Clean modular architecture  
- Strong frontend abstraction design  
- Graph theory implementation  
- Efficient JSON parsing  
- Scalable backend validation  
- Production-ready deployment  

---

# 📈 Why This Project Stands Out

✔ Demonstrates real system design thinking  
✔ Combines frontend UX + backend computation  
✔ Applies graph theory concepts practically  
✔ Shows production deployment capability  
✔ Clean separation of concerns  

---

# 👨‍💻 Author

**Rupesh KLR**  
Full Stack Engineer  
React • FastAPI • System Design • Scalable Architecture

---

⭐ If you found this project interesting, feel free to star the repository!
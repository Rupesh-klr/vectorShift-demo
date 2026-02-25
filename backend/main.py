from fastapi import FastAPI, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import json
import os
from datetime import datetime

app = FastAPI()
@app.get('/')
def read_root():
    return {'Ping': 'Pong'}
# Name of our local database file
DB_FILE = "dbstore.json"
MAX_VERSIONS = 20  # Constant to limit the history size

# Add CORS so React can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/pipelines/parse')
async def parse_pipeline(request: Request):
    data = await request.json()
    
    # Extract the client_id from the frontend (default to 'unknown' just in case)
    client_id = data.get('client_id', 'unknown')
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # --- DAG Check Logic ---
    graph = defaultdict(list)
    for edge in edges:
        graph[edge['source']].append(edge['target'])
        
    def is_cyclic():
        visited = set()
        rec_stack = set()
        def dfs(node):
            visited.add(node)
            rec_stack.add(node)
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    if dfs(neighbor): return True
                elif neighbor in rec_stack:
                    return True
            rec_stack.remove(node)
            return False
            
        for node in [n['id'] for n in nodes]:
            if node not in visited:
                if dfs(node): return True
        return False
        
    is_dag = not is_cyclic()
    current_timestamp = datetime.now().isoformat()
    current_submission = {
        "timestamp": current_timestamp,
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
        "nodes": nodes,
        "edges": edges
    }
    db_data = {}
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            try:
                db_data = json.load(f)
            except json.JSONDecodeError:
                db_data = {} # Reset if file is empty or corrupted
                
    # 4. Initialize client history if they are new
    if client_id not in db_data:
        db_data[client_id] = {
            "version_history": []
        }
        
    # 5. Append the new submission to their history
    history = db_data[client_id]["version_history"]
    history.append(current_submission)
    
    # 6. Enforce MAX_VERSIONS limit (Keep only the latest 20)
    if len(history) > MAX_VERSIONS:
        history = history[-MAX_VERSIONS:]
        db_data[client_id]["version_history"] = history
        
    current_version = len(history)
    
    # 7. Save back to the JSON file
    with open(DB_FILE, "w") as f:
        # Added indent=4 so the JSON file is readable if you open it in VS Code
        json.dump(db_data, f, indent=4)
        
    # 8. Return the requested response format
    return {
        "num_nodes": num_nodes, 
        "num_edges": num_edges, 
        "is_dag": is_dag,
        "current_version_size": current_version,
        "timestamp": current_timestamp
    }


# --- NEW: Dynamic Endpoint for the Refresh Button ---
@app.get('/pipelines/{client_id}')
def get_pipeline(client_id: str):
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            db_data = json.load(f)
            # If we find the client ID, return their specific nodes and edges
            if client_id in db_data:
                return db_data[client_id]
                
    # If no file or no client ID match
    return {"message": "Not found"}


@app.get('/pipelines/last-submit')
def get_last_submit():
    # Check if the file exists (it won't the very first time you run the server)
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            last_data = json.load(f)
            return last_data
    else:
        return {"message": "No previous submissions found."}
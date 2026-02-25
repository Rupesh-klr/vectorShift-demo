// store.js

import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'; // 1. Import devtools
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';
export  function getClientId(){
  let clientId = localStorage.getItem('vector_shift_client_id');
    if (!clientId) {
        // Create a random unique ID (e.g., "client_a1b2c3d4e")
        clientId = 'client_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('vector_shift_client_id', clientId);
    }
    return clientId;
}
export const useStore = create(devtools(persist((set, get) => ({
    nodes: [],
    edges: [],
    // --- History State ---
    serverHistory: [],
    historyIndex: -1,
    localHistory:[],
    activeLocalchanges:false,

    // --- History Actions ---
    // --- History Actions ---
    loadHistoryFromServer: (historyArray, isLocalActive) => {
        if (!historyArray || historyArray.length === 0) return;
        
        const latestIndex = historyArray.length - 1;
        
        set({ 
            serverHistory: historyArray, 
            historyIndex: latestIndex,
            activeLocalchanges: isLocalActive 
        });
        
        const latestVersion = historyArray[latestIndex];
        get().setNodes(latestVersion.nodes || []);
        get().setEdges(latestVersion.edges || []);
    },
    saveLocalSnapshot: () => {
        const { nodes, edges, localHistory, historyIndex } = get();
        
        // 1. If we went back in time and make a new change, slice off the "future" versions
        const currentHistory = localHistory.slice(0, historyIndex + 1);
        
        // 2. Add the current state to the array
        currentHistory.push({ nodes, edges });
        
        // 3. Keep the array size manageable (e.g., max 60 local changes)
        if (currentHistory.length > 60) {
            currentHistory.shift(); // Removes the oldest item
        }
        
        // 4. Update the state and force activeLocalchanges to true
        set({
            localHistory: currentHistory,
            historyIndex: currentHistory.length - 1,
            activeLocalchanges: true // Instantly switch UI to Local Mode
        });
    },

    // NEW: Function to easily toggle the mode and reset the index
    toggleHistoryMode: () => {
        const { activeLocalchanges, localHistory, serverHistory } = get();
        const newMode = !activeLocalchanges; // Flip the boolean
        
        // Pick the target array based on the new mode
        const targetArray = newMode ? localHistory : serverHistory;
        const newIndex = targetArray.length > 0 ? targetArray.length - 1 : 0;
        
        set({ 
            activeLocalchanges: newMode,
            historyIndex: newIndex
        });

        // Update canvas to the latest version of the newly selected mode
        if (targetArray.length > 0) {
            get().setNodes(targetArray[newIndex].nodes || []);
            get().setEdges(targetArray[newIndex].edges || []);
        }
    },

    stepBack: () => {
        const { activeLocalchanges, localHistory, serverHistory, historyIndex, setNodes, setEdges } = get();
        
        // Dynamically choose the array we are navigating
        const currentArray = activeLocalchanges ? localHistory : serverHistory;
        console.log(currentArray+"----")
        
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            set({ historyIndex: newIndex });
            setNodes(currentArray[newIndex].nodes || []);
            setEdges(currentArray[newIndex].edges || []);
        }
    },

    stepForward: () => {
        const { activeLocalchanges, localHistory, serverHistory, historyIndex, setNodes, setEdges } = get();
        
        const currentArray = activeLocalchanges ? localHistory : serverHistory;
        console.log(currentArray+">>>>")
        if (historyIndex < currentArray.length - 1) {
            const newIndex = historyIndex + 1;
            set({ historyIndex: newIndex });
            setNodes(currentArray[newIndex].nodes || []);
            setEdges(currentArray[newIndex].edges || []);
        }
    },
    // <-- Fixed these so they actually update the state
        setNodes: (nodes) => { set({ nodes }); },
        setEdges: (edges) => { set({ edges }); },
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
        get().saveLocalSnapshot(); // <-- Trigger snapshot
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
      // Only trigger snapshot if a node was explicitly removed
        const isStructuralChange = changes.some(change => change.type === 'remove');
        if (isStructuralChange) {
            get().saveLocalSnapshot(); // <-- Trigger snapshot
        }
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, 
          type: 'customEdge', // MUST match the key in edgeTypes exactly
          animated: true, 
        }, get().edges),
           //markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}
      });
      get().saveLocalSnapshot(); // <-- Trigger snapshot
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
      get().saveLocalSnapshot();
    },
    removeNode: (nodeId) => {
        set({
            // Remove the node
            nodes: get().nodes.filter((n) => n.id !== nodeId),
            // Clean up any edges connected to this node
            edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
        });
        get().saveLocalSnapshot(); // Save this deletion to history!
    },
    removeEdge: (edgeId) => {
        set({
            edges: get().edges.filter((e) => e.id !== edgeId)
        });
        get().saveLocalSnapshot(); // Save to history!
    },
  }),
  {
        name: 'vector-shift-pipeline-storage', 
      }
)));
if (typeof window !== 'undefined') {
    window.zustandStore = useStore;
}
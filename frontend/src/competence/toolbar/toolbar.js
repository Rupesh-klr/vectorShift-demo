// toolbar.js

import { DraggableNode } from './draggableNode';
import { useStore 
    
} from '../../hooks/store';
export const PipelineToolbar = () => {
    const { 
        loadHistoryFromServer, 
        toggleHistoryMode,
        stepBack, 
        stepForward, 
        historyIndex, 
        serverHistory,
        localHistory,
        activeLocalchanges 
    } = useStore();
    const currentActiveArray = activeLocalchanges ? localHistory : serverHistory;
    // const fetchHistory = async () => {
    //     const clientId = localStorage.getItem('vector_shift_client_id');
        
    //     if (!clientId) {
    //         alert("No client ID found! Please submit a pipeline first.");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`http://localhost:8000/pipelines/${clientId}`);
    //         const data = await response.json();

    //         // Look closely at your network tab screenshot: the array is called "version_history"
    //         if (data.version_history && data.version_history.length > 0) {
    //             loadHistoryFromServer(data.version_history);
    //             alert(`Loaded ${data.version_history.length} versions from the server! ♻️`);
    //         } else {
    //             alert("No history found for this browser on the server.");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         alert("Failed to fetch history from the server.");
    //     }
    // };
    const handleToggleAndFetch = async () => {
        // 1. If we are currently in Local mode, switch to Server mode and fetch
        if (activeLocalchanges) {
            const clientId = localStorage.getItem('vector_shift_client_id');
            if (!clientId) {
                // Create a random unique ID (e.g., "client_a1b2c3d4e")
                alert("No client ID found! Please submit a pipeline first.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/pipelines/${clientId}`);
                const data = await response.json();

                if (data.version_history && data.version_history.length > 0) {
                    // Pass the array and set activeLocalchanges to false (Server Mode)
                    loadHistoryFromServer(data.version_history, false);
                } else {
                    alert("No history found on the server.");
                }
            } catch (error) {
                console.error(error);
                alert("Failed to fetch history from the server.");
            }
        } else {
            // 2. If we are in Server mode, just toggle back to Local mode
            toggleHistoryMode();
        }
    };
    return (
        <div
        style={{ 
            padding: '10px', 
            marginInline:"30px",
            display: 'flex', 
            justifyContent: 'space-between', // Pushes left and right sections apart
            alignItems: 'center',
            borderBottom: '1px solid #ddd' // Optional: adds a nice separator line
        }}>
        {/*   style={{ padding: '10px' }}> */}
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
            </div>

            {/* RIGHT SIDE: Server Fetch & Navigation Arrows */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' ,marginInline:"30px",}}>
                {/* <button 
                    onClick={fetchHistory}
                    style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}
                >
                    ☁️ Load Server History
                </button> */}

                <button 
                    onClick={handleToggleAndFetch}
                    title={`Local Storage History: ${localHistory.length} | Server History: ${serverHistory.length}`}
                    style={{ 
                        padding: '8px 16px', 
                        cursor: 'pointer', 
                        borderRadius: '4px',
                        backgroundColor: activeLocalchanges ? '#e0f7fa' : '#ede7f6',
                        border: '1px solid #ccc',
                        fontWeight: 'bold'
                    }}
                >
                    {activeLocalchanges ? "💻 Local Mode (Click for Server)" : "☁️ Server Mode (Click for Local)"}
                </button>
                
                <button 
                    onClick={stepBack} 
                    disabled={historyIndex <= 0}
                    style={{ padding: '8px 12px', cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer' }}
                >
                    &larr;
                </button>

                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {currentActiveArray.length > 0 ? `${historyIndex + 1} / ${currentActiveArray.length}` : '0 / 0'}
                </span>

                <button 
                    onClick={stepForward} 
                    disabled={historyIndex >= currentActiveArray.length - 1 || currentActiveArray.length === 0}
                    style={{ padding: '8px 12px', cursor: (historyIndex >= currentActiveArray.length - 1) ? 'not-allowed' : 'pointer' }}
                >
                    &rarr;
                </button>
            </div>
        </div>
    );
};

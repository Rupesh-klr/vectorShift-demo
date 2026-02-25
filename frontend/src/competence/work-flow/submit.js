// /frontend/src/submit.js
import { useStore, getClientId } from '../../hooks/store'; // Make sure this path points to your actual store file!


export const SubmitButton = () => {
    // 1. Grab the current nodes and edges from the global state
    const { nodes, edges } = useStore((state) => ({
        nodes: state.nodes,
        edges: state.edges,
        setNodes: state.setNodes, // Adjust these to match your actual store methods
        setEdges: state.setEdges
    }));
    const clientId = getClientId();
    // --- SAVE PIPELINE ---
    const submitPipeline = async () => {
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Add the unique client_id to the payload
                body: JSON.stringify({ client_id: clientId, nodes: nodes, edges: edges }),
            });

            const data = await response.json();
            alert(`Nodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag}`);
        } catch (error) {
            console.error(error);
            alert("Failed to submit.");
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
            <button type="button" onClick={submitPipeline}>Submit</button>
            {/* <button type="button" onClick={refreshPipeline}>Refresh (Restore)</button> */}
        </div>
    );
}
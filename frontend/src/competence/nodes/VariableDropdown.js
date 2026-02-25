// VariableDropdown.js
import React, { useEffect, useRef } from 'react';
import { useStore } from '../../hooks/store';

export const VariableDropdown = ({ currentNodeId, onSelect, onClose }) => {
  const dropdownRef = useRef(null);
  
  // 1. Fetch all nodes from the global store
  const allNodes = useStore((state) => state.nodes);
  
  // 2. Filter out the current node so it doesn't reference itself
  const availableNodes = allNodes.filter(node => node.id !== currentNodeId);

  // 3. Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Helper to get nice icons based on node type
  const getNodeIcon = (type) => {
    if (type === 'customInput') return '➡️';
    if (type === 'llm') return '🧠';
    if (type === 'customOutput') return '🚪';
    return '📄';
  };

  return (
    <div ref={dropdownRef} style={{
        position: 'absolute', top: '100%', left: 0, width: 'calc(100% - 30px)', zIndex: 1000,
        backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', 
        marginTop: '4px', padding: '12px', maxHeight: '250px', overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Fake progress bar mimicking your screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', justifyContent: 'center', fontSize: '13px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontWeight: '600' }}>
            <span style={{ fontSize: '10px' }}>🔵</span> Step 1
         </div>
         <div style={{ height: '2px', width: '30px', backgroundColor: '#e0e7ff', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '50%', backgroundColor: '#4f46e5' }}></div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontWeight: '500' }}>
            <span style={{ fontSize: '10px', color: '#e2e8f0' }}>⚪</span> Step 2
         </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 -12px 12px' }} />

      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.5px' }}>
        NODES
      </div>
      
      {availableNodes.length === 0 ? (
        <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', padding: '4px' }}>No other nodes available</div>
      ) : (
        availableNodes.map(node => {
          // Determine the display name (InputName > OutputName > ID)
          const displayName = node.data?.inputName || node.data?.outputName || node.id;
          const displayType = node.type.replace('custom', '');

          return (
            <div
              key={node.id}
              onClick={() => onSelect(displayName)}
              style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', marginBottom: '4px', borderRadius: '6px', cursor: 'pointer',
                  backgroundColor: '#fff', border: '1px solid transparent', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f3ff'; e.currentTarget.style.borderColor = '#ede9fe'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1e293b', fontWeight: '500' }}>
                  <span style={{ fontSize: '14px' }}>{getNodeIcon(node.type)}</span> 
                  {displayName}
              </div>
              <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                  {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};
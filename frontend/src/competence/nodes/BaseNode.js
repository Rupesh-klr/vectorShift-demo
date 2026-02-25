// BaseNode.js
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../hooks/store'; 
import { useUpdateNodeInternals } from 'reactflow';

export const BaseNode = ({ id, title, icon, colorTheme, children }) => {
  const removeNode = useStore((state) => state.removeNode);
  const updateNodeInternals = useUpdateNodeInternals();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [deleteStage, setDeleteStage] = useState(0);
  
  const [isHovered, setIsHovered] = useState(false); 
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  
  const nodeRef = useRef(null);
  
  // THE FIX: Tell React Flow to recalculate edges after the node shrinks/expands
  useEffect(() => {
    // Fire instantly for responsiveness
    updateNodeInternals(id);
    // Fire a split second later to guarantee the DOM finished resizing
    const timer = setTimeout(() => updateNodeInternals(id), 50);
    return () => clearTimeout(timer);
  }, [isExpanded, id, updateNodeInternals]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setShowSettings(false);
        setDeleteStage(0); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteClick = () => {
    if (deleteStage === 0) {
      setDeleteStage(1); 
    } else {
      removeNode(id); 
    }
  };

  const colors = {
    border: colorTheme || '#6366f1', 
    textDark: '#1e293b',
    textMuted: '#64748b',
    glow: `${colorTheme || '#6366f1'}40` 
  };

  return (
    <div 
      ref={nodeRef} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isExpanded ? '' : `node-collapsed-${id}`}
      style={{
        width: 300, 
        border: `2px solid ${colors.border}`, 
        borderRadius: '12px', 
        backgroundColor: '#fff',
        // Hover Lighting Glow Effect
        boxShadow: isHovered 
            ? `0 0 20px ${colors.glow}, 0 4px 6px -1px rgb(0 0 0 / 0.1)` 
            : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        transition: 'box-shadow 0.3s ease-in-out',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative' 
    }}>
      
      {/* THE FLAWLESS CSS COLLAPSE TRICK */}
      <style>
        {`
          .node-collapsed-${id} .node-content-wrapper {
             height: 0px !important;
             padding: 0px 16px !important;
             margin: 0px !important;
          }
          /* Hide all text, inputs, and backgrounds inside the wrapper */
          .node-collapsed-${id} .node-content-wrapper > *:not(.react-flow__handle) {
             opacity: 0 !important;
             pointer-events: none !important;
             height: 0px !important;
             margin: 0px !important;
          }
          /* Force Handles to break out of their inline relative divs */
          .node-collapsed-${id} .react-flow__handle {
             visibility: visible !important;
             opacity: 1 !important;
             pointer-events: all !important;
             /* Force absolute positioning to break free from inline styles */
             position: absolute !important;
             /* Move to the center of the header (which is roughly 28px tall) */
             top: 28px !important; 
             transform: translateY(-50%) !important;
             transition: top 0.3s ease-in-out;
          }
        `}
      </style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: isHovered ? '#f8fafc' : 'transparent', borderRadius: '10px 10px 0 0', transition: 'background-color 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '16px', color: colors.textDark }}>
          <span>{icon}</span> {title}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: colors.textMuted, fontSize: '14px' }}>
          
          {/* Expand/Collapse Button */}
          <span 
            onClick={() => setIsExpanded(!isExpanded)} 
            style={{ 
                cursor: 'pointer', padding: '2px 6px', 
                backgroundColor: isExpanded ? 'transparent' : '#334155',
                color: isExpanded ? 'inherit' : '#fff',
                borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
            }} 
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? '↙️' : '↗️'} 
          </span>
          
          <span onClick={() => setShowSettings(!showSettings)} style={{ cursor: 'pointer', padding: '2px' }} title="Settings">
            ⚙️
          </span>
          
          <div style={{ position: 'relative' }}>
            <span 
              onClick={handleDeleteClick}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              style={{ 
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: deleteStage === 1 ? '#ef4444' : 'transparent',
                color: deleteStage === 1 ? '#fff' : colors.textMuted,
                transition: 'all 0.2s'
              }}
            >
              ⓧ
            </span>
            {(isDeleteHovered || deleteStage === 1) && (
              <div style={{
                  position: 'absolute', top: '25px', right: 0, zIndex: 50,
                  backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px',
                  padding: '4px 8px', fontSize: '12px', color: colors.textDark,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', whiteSpace: 'nowrap'
              }}>
                {deleteStage === 1 ? "Confirm delete" : "Delete node"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="node-content-wrapper" style={{ padding: '0 16px 16px' }}>
        {children}
      </div>

      {/* SETTINGS POPOVER */}
      {showSettings && (
        <div style={{
            position: 'absolute', top: '40px', left: '102%', width: '250px', zIndex: 100,
            backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: colors.border, fontWeight: '600' }}>
            Settings <span onClick={() => setShowSettings(false)} style={{cursor: 'pointer', color: '#64748b'}}>ⓧ</span>
          </div>
          <label style={{ fontSize: '12px', fontWeight: '500', color: colors.textDark, marginBottom: '4px', display: 'block' }}>
            Description ❔
          </label>
          <textarea 
            placeholder="Enter a description for this input"
            style={{ width: '100%', height: '60px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'none', fontSize: '12px', marginBottom: '12px' }}
          />
        </div>
      )}
    </div>
  );
};
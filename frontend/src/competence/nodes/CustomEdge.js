// CustomEdge.js
import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { useStore } from '../../hooks/store';

export const CustomEdge = ({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd,
}) => {
  const removeEdge = useStore((state) => state.removeEdge);
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  const edgeColor = isHovered ? '#6366f1' : '#b1b1b7'; 
  const strokeWidth = isHovered ? 2.5 : 1.5;

  return (
    // Wrap both paths in a group <g> to easily catch hover events anywhere on the line
    <g 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. The Visible Edge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: edgeColor, strokeWidth: strokeWidth, transition: 'all 0.3s' }}
      />

      {/* 2. The Invisible Hitbox Line (Changed to transparent stroke) */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent" // <-- Crucial change: transparent instead of opacity 0
        strokeWidth={20} 
        className="react-flow__edge-interaction"
      />

      {/* 3. The Custom "X" Delete Button */}
      {/* 3. The Custom "X" Delete Button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            
            // THE FIXES:
            zIndex: 1000,          // 1. Forces the button to the very front layer
            pointerEvents: 'all',  // 2. Ensures the browser registers clicks on this div
            opacity: isHovered ? 1 : 0, 
            transition: 'opacity 0.2s',
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            // Switched to a single click for better UX, and added stopPropagation!
            onClick={(event) => {
              event.stopPropagation(); // 3. Stops React Flow from thinking you clicked the background
              removeEdge(id);
            }} 
            title="Click to delete edge"
            style={{
              width: '24px', height: '24px', background: '#e0e7ff', border: '2px solid #6366f1',
              cursor: 'pointer', borderRadius: '50%', color: '#6366f1', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)' // Slightly stronger shadow to pop off the page
            }}
          >
            ×
          </div>
        </div>
      </EdgeLabelRenderer>
    </g>
  );
};
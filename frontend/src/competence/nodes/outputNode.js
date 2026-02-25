// outputNode.js
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../hooks/store'; 
import { BaseNode } from './BaseNode'; // Import the abstraction

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(data?.outputName || 'output_0');
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const [formatOutput, setFormatOutput] = useState(true);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value); 
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value); 
  };

  const colors = {
    border: '#ef4444', // Red 500 for Output
    bgLight: '#e0e7ff', 
    textDark: '#1e293b',
    textMuted: '#64748b'
  };

  // Validation logic
  const hasError = currName.trim() === '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: 300 }}>
      
      {/* Wrap the main node content in the BaseNode */}
      <BaseNode id={id} title="Output" icon="🚪" colorTheme={colors.border}>
        
        {/* SUBTEXT */}
        <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '16px', lineHeight: '1.4' }}>
          Output data of different types from your workflow.
        </div>
        
        {/* ID DISPLAY */}
        <div style={{ width: '100%', padding: '6px', backgroundColor: colors.bgLight, borderRadius: '6px', color: colors.textDark, fontSize: '14px', textAlign: 'center', marginBottom: '16px', boxSizing: 'border-box' }}>
          {currName || 'output_0'}
        </div>

        {/* TYPE DROPDOWN */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Handle type="target" position={Position.Left} id={`${id}-value`} style={{ left: '-25px', top: '65%', width: '12px', height: '12px', background: '#fff', border: `2px solid ${colors.border}` }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Type <span>❔</span></label>
            <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#6366f1', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>Dropdown</span>
          </div>
          <select 
            value={outputType} onChange={handleTypeChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', color: colors.textDark, fontSize: '14px', boxSizing: 'border-box', appearance: 'none' }}
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </div>

        {/* OUTPUT NAME INPUT */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Output <span style={{color: 'red'}}>*</span></label>
            <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                <span style={{fontSize: '10px'}}>🤖 + ↗</span> 
                <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#6366f1', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>Text</span>
            </div>
          </div>
          <input 
            type="text" value={currName} onChange={handleNameChange} placeholder='Type "{{" to utilize variables'
            style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', color: colors.textDark, fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>

        {/* FORMAT OUTPUT TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Format output</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted, fontWeight: '500' }}>{formatOutput ? 'Yes' : 'No'}</span>
            <div 
              onClick={() => setFormatOutput(!formatOutput)}
              style={{ width: '36px', height: '20px', backgroundColor: formatOutput ? '#4f46e5' : '#e2e8f0', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
            >
              <div style={{ width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: formatOutput ? '18px' : '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: 'left 0.2s' }}></div>
            </div>
          </div>
        </div>
      </BaseNode>

      {/* ERROR BANNER (Stays outside the BaseNode) */}
      {hasError && (
        <div style={{
          padding: '10px 16px',
          border: '1px solid #ef4444', 
          borderRadius: '8px',
          backgroundColor: '#fef2f2',
          color: '#b91c1c', 
          fontSize: '13px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>❗</span> Output field is required
        </div>
      )}
    </div>
  );
}
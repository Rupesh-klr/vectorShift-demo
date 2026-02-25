// inputNode.js
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../hooks/store'; 
import { BaseNode } from './BaseNode'; // Import the new wrapper

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'inputName', e.target.value); 
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, 'inputType', e.target.value); 
  };

  return (
    // We pass the common UI data to BaseNode, and put the unique logic inside it!
    <BaseNode id={id} title="Input" icon="➡️" colorTheme="#6366f1">
        
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
        Pass data of different types into your workflow
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <input 
          type="text" value={currName} onChange={handleNameChange} 
          style={{ width: '100%', padding: '8px', backgroundColor: '#e0e7ff', border: 'none', borderRadius: '6px', textAlign: 'center', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ position: 'relative' }}>
        <label style={{ fontSize: '13px', fontWeight: '600' }}>Type</label>
        <select 
          value={inputType} onChange={handleTypeChange}
          style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>

        <Handle type="source" position={Position.Right} id={`${id}-value`} style={{ right: '-25px', top: '70%', background: '#fff', border: `2px solid #6366f1` }} />
      </div>

    </BaseNode>
  );
}
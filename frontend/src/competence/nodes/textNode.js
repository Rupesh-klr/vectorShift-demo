// textNode.js
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../hooks/store';
import { BaseNode } from './BaseNode'; 
import { VariableDropdown } from './VariableDropdown'; // <-- Import the new component

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  
  // Dropdown Autocomplete State
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  
  const textAreaRef = useRef(null);

  // Regex logic to dynamically create handles based on {{variables}}
  useEffect(() => {
    const regex = /{{\s*([a-zA-Z0-9_.-]+)\s*}}/g;
    const matches = [...currText.matchAll(regex)].map(match => match[1]);
    const uniqueVariables = [...new Set(matches)];
    setVariables(uniqueVariables);

    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  // Trigger dropdown if ending with '{{'
  const handleTextChange = (e) => {
    const newText = e.target.value;
    const currentCursor = e.target.selectionStart;
    
    setCurrText(newText);
    updateNodeField(id, 'text', newText);

    const textBeforeCursor = newText.slice(0, currentCursor);
    if (textBeforeCursor.endsWith('{{')) {
      setShowDropdown(true);
      setCursorPos(currentCursor);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle selecting a node from the new dropdown component
  const handleSelectVariable = (variableName) => {
    const before = currText.slice(0, cursorPos);
    const after = currText.slice(cursorPos);
    
    const updatedText = before + variableName + '}}' + after;
    
    setCurrText(updatedText);
    updateNodeField(id, 'text', updatedText);
    setShowDropdown(false);
    
    if (textAreaRef.current) textAreaRef.current.focus();
  };

  const colors = {
    border: '#8b5cf6', 
    bgLight: '#ede9fe',
    textDark: '#1e293b',
    textMuted: '#64748b'
  };

  const hasError = currText.trim() === '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: 320 }}>
      <BaseNode id={id} title="Text" icon="📄" colorTheme={colors.border}>
        
        <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '16px', lineHeight: '1.4' }}>
          Accepts Text from upstream nodes and allows you to write additional text to pass to downstream nodes.
        </div>
        
        {/* DYNAMIC HANDLES (Variables) */}
        {variables.map((variableName) => (
          <div key={`${id}-${variableName}`} style={{ position: 'relative', marginBottom: '8px' }}>
            <Handle type="target" position={Position.Left} id={`${id}-${variableName}`} style={{ left: '-25px', top: '50%', width: '12px', height: '12px', background: '#fff', border: `2px solid ${colors.border}` }} />
            <span style={{ fontSize: '12px', color: colors.textDark, fontWeight: '500' }}>Input: {variableName}</span>
          </div>
        ))}

        {/* TEXT AREA INPUT ROW */}
        <div style={{ position: 'relative', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Text <span style={{color: 'red'}}>*</span> <span>❔</span></label>
            <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                <span style={{fontSize: '10px'}}>🤖 + ↗</span> 
                <span style={{ fontSize: '11px', backgroundColor: colors.bgLight, color: colors.border, padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>Text</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <textarea 
              ref={textAreaRef}
              value={currText} onChange={handleTextChange} 
              placeholder='Type "{{" to utilize variables'
              style={{ flex: 1, minHeight: '40px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', color: colors.textDark, fontSize: '13px', resize: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ cursor: 'pointer', color: '#ef4444', padding: '8px 4px' }} title="Clear Text" onClick={() => { setCurrText(''); updateNodeField(id, 'text', ''); }}>
              🗑️
            </div>
          </div>

          <Handle type="source" position={Position.Right} id={`${id}-output`} style={{ right: '-25px', top: '50%', width: '12px', height: '12px', background: '#fff', border: `2px solid ${colors.border}` }} />

          {/* THE NEW CLEAN DROPDOWN COMPONENT */}
          {showDropdown && (
            <VariableDropdown 
              currentNodeId={id} 
              onSelect={handleSelectVariable} 
              onClose={() => setShowDropdown(false)} 
            />
          )}

        </div>
      </BaseNode>

      {/* ERROR BANNER */}
      {hasError && (
        <div style={{ padding: '10px 16px', border: '1px solid #ef4444', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>❗</span> Text field is required
        </div>
      )}
    </div>
  );
}
// llmNode.js
import { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../hooks/store';
import { BaseNode } from './BaseNode';
import { VariableDropdown } from './VariableDropdown'; // <-- Import the dropdown component

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Field states
  const [system, setSystem] = useState(data?.system || 'Answer the question based on context in a professional manner');
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [model, setModel] = useState(data?.model || 'gpt-5.1');
  const [usePersonalApiKey, setUsePersonalApiKey] = useState(data?.usePersonalApiKey || false); // <-- Added Toggle State

  // Autocomplete Dropdown States
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const promptRef = useRef(null);

  const handleSystemChange = (e) => {
    setSystem(e.target.value);
    updateNodeField(id, 'system', e.target.value);
  };

  // Upgraded Prompt Change to track cursor for "{{"
  const handlePromptChange = (e) => {
    const newText = e.target.value;
    const currentCursor = e.target.selectionStart;
    
    setPrompt(newText);
    updateNodeField(id, 'prompt', newText);

    const textBeforeCursor = newText.slice(0, currentCursor);
    if (textBeforeCursor.endsWith('{{')) {
      setShowDropdown(true);
      setCursorPos(currentCursor);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle selecting a node from the dropdown
  const handleSelectVariable = (variableName) => {
    const before = prompt.slice(0, cursorPos);
    const after = prompt.slice(cursorPos);
    
    const updatedText = before + variableName + '}}' + after;
    
    setPrompt(updatedText);
    updateNodeField(id, 'prompt', updatedText);
    setShowDropdown(false);
    
    if (promptRef.current) promptRef.current.focus();
  };

  // Handle the Toggle Switch
  const handleToggleApiKey = () => {
    const newValue = !usePersonalApiKey;
    setUsePersonalApiKey(newValue);
    updateNodeField(id, 'usePersonalApiKey', newValue);
  };

  const colors = {
    border: '#00897b', // Emerald Green for LLM theme
    bgLight: '#e0f2f1', 
    textDark: '#1e293b',
    textMuted: '#64748b'
  };

  const Badge = ({ text }) => (
    <span style={{ fontSize: '11px', backgroundColor: colors.bgLight, color: colors.border, padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
      {text}
    </span>
  );

  return (
    <BaseNode id={id} title="OpenAI" icon="🧠" colorTheme={colors.border}>
      
      {/* Node ID Display */}
      <div style={{ width: '100%', padding: '6px', backgroundColor: colors.bgLight, borderRadius: '6px', color: colors.textDark, fontSize: '14px', textAlign: 'center', marginBottom: '16px', boxSizing: 'border-box' }}>
        {id}
      </div>

      {/* SYSTEM INSTRUCTIONS */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Handle type="target" position={Position.Left} id={`${id}-system`} style={{ left: '-25px', top: '60%', width: '12px', height: '12px', background: '#fff', border: `2px solid ${colors.border}` }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>System (Instructions) <span>❔</span></label>
          <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}><span style={{fontSize: '10px'}}>🤖 + ↗</span> <Badge text="Text" /></div>
        </div>
        <textarea 
          value={system} onChange={handleSystemChange}
          style={{ width: '100%', height: '60px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', color: colors.textMuted, fontSize: '13px', resize: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* PROMPT (Now with Autocomplete support) */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Handle type="target" position={Position.Left} id={`${id}-prompt`} style={{ left: '-25px', top: '60%', width: '12px', height: '12px', background: '#fff', border: `2px solid ${colors.border}` }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Prompt <span>❔</span></label>
          <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}><span style={{fontSize: '10px'}}>🤖 + ↗</span> <Badge text="Text" /></div>
        </div>
        <textarea 
          ref={promptRef}
          value={prompt} onChange={handlePromptChange} placeholder='Type "{{" to utilize variable.'
          style={{ width: '100%', height: '60px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', color: colors.textDark, fontSize: '13px', resize: 'none', boxSizing: 'border-box' }}
        />

        {/* The Reusable Dropdown Autocomplete */}
        {showDropdown && (
          <VariableDropdown 
            currentNodeId={id} 
            onSelect={handleSelectVariable} 
            onClose={() => setShowDropdown(false)} 
          />
        )}
      </div>

      {/* MODEL DROPDOWN */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Model <span>❔</span></label>
          <Badge text="Dropdown" />
        </div>
        <select value={model} onChange={(e) => { setModel(e.target.value); updateNodeField(id, 'model', e.target.value); }}
          style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', color: colors.textDark, fontSize: '14px', boxSizing: 'border-box' }}>
          <option value="gpt-5.1">gpt-5.1</option>
          <option value="gpt-4">gpt-4</option>
        </select>
        
        <Handle type="source" position={Position.Right} id={`${id}-response`} style={{ right: '-25px', top: '20px', width: '12px', height: '12px', background: '#fff', border: `2px solid ${colors.border}` }} />
      </div>

      {/* FULLY FUNCTIONAL API KEY TOGGLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: colors.textDark }}>Use Personal Api Key <span>❔</span></label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          <span style={{ fontSize: '13px', color: colors.textMuted, fontWeight: '500' }}>
            {usePersonalApiKey ? 'Yes' : 'No'}
          </span>
          
          {/* Animated Toggle Switch */}
          <div 
            onClick={handleToggleApiKey}
            style={{ 
              width: '36px', height: '20px', 
              backgroundColor: usePersonalApiKey ? colors.border : '#e2e8f0', // Changes to green when active
              borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' 
            }}
          >
            <div style={{ 
              width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', 
              position: 'absolute', top: '2px', 
              left: usePersonalApiKey ? '18px' : '2px', // Slides back and forth
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: 'left 0.2s' 
            }}></div>
          </div>

        </div>
      </div>

    </BaseNode>
  );
}
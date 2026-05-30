import React from 'react';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

/**
 * CodeEditor Component
 * Provides an interactive code editor for Java code input using Monaco Editor.
 */
const CodeEditor = ({ code, onChange, disabled }) => {
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h3>Input Java Code</h3>
        <span className="char-count">{code.length} characters</span>
      </div>
      <Editor
        height="400px"
        language="java"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          readOnly: disabled,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;

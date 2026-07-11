import React from 'react';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

/**
 * CodeEditor Component
 * Provides an interactive code editor for Java code input using Monaco Editor.
 */
const SAMPLE_JAVA_CODE = `public class A {
    public String x(User u) {
        if (u != null && u.getAge() > 17 && u.getName() != null && !u.getName().equals("")) {
            System.out.println("OK");
            return "Y";
        }
        return "N";
    }
}`;

const CodeEditor = ({ code, onChange, disabled }) => {
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  const handleLoadSample = () => {
    onChange(SAMPLE_JAVA_CODE);
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h3>Input Java Code</h3>
        <div className="editor-header-actions">
          <button
            type="button"
            className="load-sample-btn"
            onClick={handleLoadSample}
            disabled={disabled}
          >
            Load Sample Java Code
          </button>
          <span className="char-count">{code.length} characters</span>
        </div>
      </div>
      <Editor
        height="450px"
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

import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import CopyButton from './CopyButton';
import { getLineDifferences } from '../utils/diffUtils';
import '../styles/CodeDisplay.css';

/**
 * CodeDisplay Component
 * Displays original and refactored code side-by-side with copy functionality.
 * Highlights modified, added, and removed lines.
 */
const CodeDisplay = ({ originalCode, refactoredCode }) => {
  const originalEditorRef = useRef(null);
  const refactoredEditorRef = useRef(null);

  if (!originalCode || !refactoredCode) {
    return null;
  }

  // Calculate line differences
  const lineDifferences = getLineDifferences(originalCode, refactoredCode);

  // Apply decorations to editors after they're mounted
  const handleOriginalEditorMount = (editor) => {
    originalEditorRef.current = editor;
    applyDecorations(editor, lineDifferences, 'original');
  };

  const handleRefactoredEditorMount = (editor) => {
    refactoredEditorRef.current = editor;
    applyDecorations(editor, lineDifferences, 'refactored');
  };

  const applyDecorations = (editor, differences, type) => {
    if (!editor) return;

    const decorations = [];
    const lines = differences[type];

    Object.entries(lines).forEach(([lineNum, status]) => {
      const lineNumber = parseInt(lineNum, 10);

      let className = '';
      let glyphMarginClassName = '';
      let message = '';

      if (status === 'added') {
        className = 'line-added';
        glyphMarginClassName = 'glyph-added';
        message = 'Added line';
      } else if (status === 'removed') {
        className = 'line-removed';
        glyphMarginClassName = 'glyph-removed';
        message = 'Removed line';
      } else if (status === 'modified') {
        className = 'line-modified';
        glyphMarginClassName = 'glyph-modified';
        message = 'Modified line';
      }

      if (className) {
        decorations.push({
          range: {
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className,
            glyphMarginClassName,
            glyphMarginHoverMessage: { value: message },
          },
        });
      }
    });

    editor.deltaDecorations([], decorations);
  };

  return (
    <div className="code-display-wrapper">

      <div className="code-display-container">
        <div className="code-display-section">
          <div className="code-display-header">
            <h3>Original Code</h3>
            <CopyButton text={originalCode} label="Copy Original" />
          </div>
          <div className="code-display-editor">
            <Editor
              height="500px"
              language="java"
              value={originalCode}
              theme="vs-dark"
              onMount={handleOriginalEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                readOnly: true,
                wordWrap: 'on',
                glyphMargin: true,
              }}
            />
          </div>
        </div>

        <div className="code-display-section">
          <div className="code-display-header">
            <h3>Refactored Code</h3>
            <CopyButton text={refactoredCode} label="Copy Refactored" />
          </div>
          <div className="code-display-editor">
            <Editor
              height="500px"
              language="java"
              value={refactoredCode}
              theme="vs-dark"
              onMount={handleRefactoredEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                readOnly: true,
                wordWrap: 'on',
                glyphMargin: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;

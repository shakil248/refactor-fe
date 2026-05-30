/**
 * Utility functions for comparing original and refactored code.
 * Identifies which lines have been modified for highlighting.
 * Uses a multi-pass diff algorithm: exact matches → similar lines → remaining additions.
 */

/**
 * Compares original and refactored code line by line
 * @param {string} originalCode - The original code
 * @param {string} refactoredCode - The refactored code
 * @returns {Object} Object mapping line numbers to diff types (added, removed, modified, unchanged)
 */
export const getLineDifferences = (originalCode, refactoredCode) => {
  const originalLines = originalCode.split('\n');
  const refactoredLines = refactoredCode.split('\n');

  const differences = {
    original: {},
    refactored: {},
  };

  // Create sets of exact matches for unchanged lines
  const unchangedOriginalIndices = new Set();
  const unchangedRefactoredIndices = new Set();

  // First pass: find exact matches (unchanged lines)
  for (let origIdx = 0; origIdx < originalLines.length; origIdx++) {
    for (let refacIdx = 0; refacIdx < refactoredLines.length; refacIdx++) {
      if (
        !unchangedOriginalIndices.has(origIdx) &&
        !unchangedRefactoredIndices.has(refacIdx) &&
        originalLines[origIdx] === refactoredLines[refacIdx]
      ) {
        unchangedOriginalIndices.add(origIdx);
        unchangedRefactoredIndices.add(refacIdx);
        differences.original[origIdx + 1] = 'unchanged';
        differences.refactored[refacIdx + 1] = 'unchanged';
        break;
      }
    }
  }

  // Second pass: find removed and added lines
  const usedRefactoredIndices = new Set(unchangedRefactoredIndices);

  for (let origIdx = 0; origIdx < originalLines.length; origIdx++) {
    if (unchangedOriginalIndices.has(origIdx)) continue;

    const origLine = originalLines[origIdx];
    let foundSimilar = false;

    // Look for similar line in refactored code
    for (let refacIdx = 0; refacIdx < refactoredLines.length; refacIdx++) {
      if (usedRefactoredIndices.has(refacIdx)) continue;

      if (isSimilarLine(origLine, refactoredLines[refacIdx])) {
        differences.original[origIdx + 1] = 'modified';
        differences.refactored[refacIdx + 1] = 'modified';
        usedRefactoredIndices.add(refacIdx);
        foundSimilar = true;
        break;
      }
    }

    if (!foundSimilar) {
      differences.original[origIdx + 1] = 'removed';
    }
  }

  // Third pass: remaining unmatched lines are added
  for (let refacIdx = 0; refacIdx < refactoredLines.length; refacIdx++) {
    if (!usedRefactoredIndices.has(refacIdx)) {
      differences.refactored[refacIdx + 1] = 'added';
    }
  }

  return differences;
};


/**
 * Checks if two lines are similar (for detecting modified lines)
 * @param {string} line1 - First line
 * @param {string} line2 - Second line
 * @returns {boolean} True if lines are similar
 */
function isSimilarLine(line1, line2) {
  // Remove whitespace for comparison
  const clean1 = line1.trim();
  const clean2 = line2.trim();

  // Calculate similarity ratio
  const similarity = getStringSimilarity(clean1, clean2);
  return similarity > 0.7; // 70% similarity threshold
}

/**
 * Calculates similarity between two strings using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity ratio (0-1)
 */
function getStringSimilarity(str1, str2) {
  const distance = getLevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  return 1 - distance / maxLength;
}

/**
 * Calculates Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Levenshtein distance
 */
function getLevenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Gets the decoration options for Monaco Editor to highlight changed lines
 * @param {Object} lineDifferences - The line differences object
 * @param {string} type - 'original' or 'refactored'
 * @returns {Array} Array of decoration objects for Monaco Editor
 */
export const getEditorDecorations = (lineDifferences, type) => {
  const decorations = [];
  const lines = lineDifferences[type];

  if (!lines) return decorations;

  Object.entries(lines).forEach(([lineNum, status]) => {
    const lineNumber = parseInt(lineNum, 10);

    if (status === 'added') {
      decorations.push({
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'line-added',
          glyphMarginClassName: 'glyph-added',
          glyphMarginHoverMessage: { value: 'Added line' },
        },
      });
    } else if (status === 'removed') {
      decorations.push({
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'line-removed',
          glyphMarginClassName: 'glyph-removed',
          glyphMarginHoverMessage: { value: 'Removed line' },
        },
      });
    } else if (status === 'modified') {
      decorations.push({
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'line-modified',
          glyphMarginClassName: 'glyph-modified',
          glyphMarginHoverMessage: { value: 'Modified line' },
        },
      });
    }
  });

  return decorations;
};

/**
 * Gets summary statistics about the changes
 * @param {Object} lineDifferences - The line differences object
 * @returns {Object} Statistics object with counts
 */
export const getChangeSummary = (lineDifferences) => {
  const stats = {
    original: { added: 0, removed: 0, modified: 0, unchanged: 0 },
    refactored: { added: 0, removed: 0, modified: 0, unchanged: 0 },
  };

  Object.values(lineDifferences.original).forEach((status) => {
    stats.original[status]++;
  });

  Object.values(lineDifferences.refactored).forEach((status) => {
    stats.refactored[status]++;
  });

  return stats;
};


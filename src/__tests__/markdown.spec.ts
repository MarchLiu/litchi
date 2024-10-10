import { to_segments } from '../markdown';

describe('LitchiDocument', () => {
  test('should split markdown into segments and code blocks', () => {
    const markdown = `
# Header
This is a markdown document.
\`\`\`javascript
const x = 5;
\`\`\`
Another paragraph after the code block.
`.trim();
    const segments = to_segments(markdown);

    expect(segments).toHaveLength(3);
    expect(segments[0].content).toBe('# Header\nThis is a markdown document.');
    expect(segments[1].category).toBe('code');
    expect(segments[1].language).toBe('javascript');
    expect(segments[1].content).toBe('const x = 5;');
    expect(segments[2].content).toBe('Another paragraph after the code block.');
  });

  test('should handle nested code blocks', () => {
    const markdown = `
\`\`\`markdown
\`\`\`javascript
const x = 5;
\`\`\`
\`\`\`
`.trim();
    const segments = to_segments(markdown);

    expect(segments).toHaveLength(2);
    expect(segments[0].content).toBe('```javascript\nconst x = 5;\n```');
  });

  test('should handle empty lines', () => {
    const markdown = `
\`\`\`javascript

\`\`\`
`.trim();
    const segments = to_segments(markdown);

    expect(segments).toHaveLength(2);
    expect(segments[0].content).toBe('');
  });

  test('should handle multiple code blocks', () => {
    const markdown = `
# Header
This is a markdown document.
\`\`\`javascript
const x = 5;
\`\`\`
Some text after the first code block.
\`\`\`typescript
let y = 10;
\`\`\`
`.trim();
    const segments = to_segments(markdown);

    expect(segments).toHaveLength(5);
    expect(segments[0].content).toBe('# Header\nThis is a markdown document.');
    expect(segments[1].category).toBe('code');
    expect(segments[1].language).toBe('javascript');
    expect(segments[1].content).toBe('const x = 5;');
    expect(segments[3].category).toBe('code');
    expect(segments[3].language).toBe('typescript');
    expect(segments[3].content).toBe('let y = 10;');
  });

  test('should handle mermaid diagrams', () => {
    const markdown = `
# Header
This is a markdown document.
\`\`\`mermaid
graph TD;
    A-->B;
\`\`\`
`.trim();
    const segments = to_segments(markdown);

    expect(segments).toHaveLength(1);
    expect(segments[0].content).toBe('# Header\nThis is a markdown document.\n```mermaid\ngraph TD;\n    A-->B;\n```');
  });
});
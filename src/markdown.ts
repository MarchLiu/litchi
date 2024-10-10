type Category = 'markdown' | 'code' | 'mermaid';

abstract class Fragment {
  private _lines: string[] = [];
  private _category: Category;
  private _language: string;

  constructor(category: Category, language: string) {
    this._category = category;
    this._language = language;
  }

  public add(line: string) {
    this._lines.push(line);
  }

  get category(): string {
    return this._category;
  }

  get language(): string {
    return this._language;
  }

  public abstract tryLine(line: string): Category | 'end';

  public static createByHead(headline: string): Fragment {
    if (headline.trim().startsWith('```')) {
      return new Code(headline);
    } else {
      return new Segment(headline);
    }
  }

  get content() {
    return this._lines.join('\n');
  }
}

class Segment extends Fragment {
  private inMermaid = false;

  constructor(head: string | undefined) {
    super('markdown', 'markdown');
    if (head !== undefined) {
      this.add(head);
    }
  }

  tryLine(l: string): Category {
    const line = l.trim();
    if (line.startsWith('```')) {
      // in mermaid
      if (line.startsWith('```mermaid') && !this.inMermaid) {
        this.inMermaid = true;
        this.add(line);
        return 'markdown';
      }
      // out mermaid
      if (line === '```' && this.inMermaid) {
        this.inMermaid = false;
        this.add(line);
        return 'markdown';
      }
      // else redirect to code
      return 'code';
    } else {
      this.add(line);
      return 'markdown';
    }
  }
}

class Code extends Fragment {
  private deep = 0;

  constructor(head: string) {
    const language = head.substring(3);
    super('code', language);
  }

  tryLine(line: string): Category | 'end' {
    if (line.trim() === '```') {
      // popup recursive code block stack
      if (this.deep === 0) {
        return 'end';
      } else {
        this.deep -= 1;
        this.add(line);
        return 'code';
      }
    } else {
      this.add(line);
      if (line.startsWith('```')) {
        // push recursive code block stack
        this.deep += 1;
      }
      return 'code';
    }
  }
}

class LitchiDocument {
  private readonly _segments: Fragment[];

  get segments(): Fragment[] {
    return this._segments;
  }

  constructor() {
    this._segments = [];
  }

  public add(line: string) {
    let latest: Fragment;
    if (this._segments.length === 0) {
      latest = Fragment.createByHead(line);
      this._segments.push(latest);
    } else {
      latest = this._segments[this._segments.length - 1];
      const tryIt = latest.tryLine(line);
      if (tryIt !== latest.category) {
        // skip try line
        if (tryIt === 'end') {
          latest = new Segment(undefined);
          this._segments.push(latest);
        } else {
          latest = Fragment.createByHead(line);
          this._segments.push(latest);
        }
      }
    }
  }
}

export function to_segments(markdown: string) {
  const doc = new LitchiDocument();
  const lines = markdown.split('\n');
  for (const idx in lines) {
    doc.add(lines[idx]);
  }
  return doc.segments;
}

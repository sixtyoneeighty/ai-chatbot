export interface UIBlock {
  documentId: string;
  content: string;
  kind: 'text';
  title: string;
  status: 'idle' | 'loading' | 'error';
  isVisible: boolean;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export type BlockKind = UIBlock['kind'];

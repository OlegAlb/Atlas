export interface IngestionEvalCase {
  id: string;

  name: string;

  fixture: string;

  input: {
    title: string;
  };

  expected: {
    mimeType: string;

    contains?: string[];

    chunks?: {
      min: number;
      max?: number;
    };
  };
}

export interface EvalCheck {
  name: string;

  passed: boolean;

  details?: string;
}

export interface IngestionEvalResult {
  id: string;

  name: string;

  passed: boolean;

  checks: EvalCheck[];
}

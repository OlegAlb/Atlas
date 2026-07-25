import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { RetrievalContext } from "../pipeline/context";

export interface RetrievalTrace {
  query: string;

  steps: RetrievalStepTrace[];
}

export interface RetrievalStepTrace {
  name: string;
  durationMs: number;
  results: RetrievalTraceItem[];
  metadata?: Record<string, unknown>;
}

export interface RetrievalTraceItem {
  documentId: string;
  chunkId: string;
  title: string;
  score: number;
  rank: number;
  source?: string;
}

export class RetrievalTracer {
  start(name: string) {
    return {
      name,
      startedAt: Date.now(),
    };
  }

  finish(
    context: RetrievalContext,
    trace: {
      name: string;
      startedAt: number;
    },
    results: KnowledgeSearchResult[],
  ) {
    this.record(context, trace.name, Date.now() - trace.startedAt, results);
  }

  record(
    context: RetrievalContext,
    name: string,
    durationMs: number,
    results: KnowledgeSearchResult[],
  ) {
    context.trace.steps.push({
      name,

      durationMs,

      results: results.map((item, index) => ({
        documentId: item.document.id,

        chunkId: item.chunk.id,

        title: item.document.title,

        score: item.score,

        rank: index + 1,

        source: item.source,
      })),
    });
  }
}

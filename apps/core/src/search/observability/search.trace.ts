import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import { SearchContext } from "../pipeline/context";

export interface SearchTrace {
  query: string;

  steps: SearchStepTrace[];
}

export interface SearchStepTrace {
  name: string;
  durationMs: number;
  results: SearchTraceItem[];
  metadata?: Record<string, unknown>;
}

export interface SearchTraceItem {
  documentId: string;
  chunkId: string;
  title: string;
  score: number;
  rank: number;
  source?: string;
}

export class SearchTracer {
  start(name: string) {
    return {
      name,
      startedAt: Date.now(),
    };
  }

  finish(
    context: SearchContext,
    trace: {
      name: string;
      startedAt: number;
    },
    results: KnowledgeSearchResult[],
  ) {
    this.record(context, trace.name, Date.now() - trace.startedAt, results);
  }

  record(
    context: SearchContext,
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

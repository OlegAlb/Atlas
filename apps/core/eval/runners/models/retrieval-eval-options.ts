import { EvaluationSearchConfig } from "../../search/models/evaluation-search-config.model";
import { SearchCase } from "../../search/models/search-case.model";

export interface RetrievalEvaluationOptions {
  datasetName: string;

  cases: SearchCase[];

  config: EvaluationSearchConfig;
}

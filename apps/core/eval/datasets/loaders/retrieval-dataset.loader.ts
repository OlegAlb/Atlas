import { SearchCase } from "../../search/models/search-case.model";
import regressionCases from "../retrieval/normal/cases.json";
import hardCases from "../retrieval/hard/cases.json";

export function getRetrievalCases(datasetName: string): SearchCase[] {
  switch (datasetName) {
    case "regression":
      return regressionCases;

    case "hard":
      return hardCases;

    default:
      throw new Error(`Unknown retrieval dataset: ${datasetName}`);
  }
}

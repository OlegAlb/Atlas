import { FastifyRequest } from "fastify";
import { KnowledgeIngestionUseCase } from "./knowledge.ingestion.usecase";
import { KnowledgeListUseCase } from "./knowledge.list.usecase";
import { CreateKnowledgeDocumentDTO } from "./knowledge.dto";

export class KnowledgeController {
  constructor(
    private readonly ingestionUseCase: KnowledgeIngestionUseCase,
    private readonly listDocumentsUseCase: KnowledgeListUseCase,
  ) {}

  createDocument = async (
    request: FastifyRequest<{
      Body: CreateKnowledgeDocumentDTO;
    }>,
  ) => {
    return this.ingestionUseCase.execute(request.body);
  };

  listDocuments = async () => {
    return this.listDocumentsUseCase.execute();
  };
}

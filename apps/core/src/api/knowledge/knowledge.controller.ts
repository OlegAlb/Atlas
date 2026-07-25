import { FastifyRequest } from "fastify";
import { KnowledgeCreateUseCase } from "../../application/knowledge/knowledge.create.usecase";
import { KnowledgeListUseCase } from "../../application/knowledge/knowledge.list.usecase";
import { CreateKnowledgeDocumentDTO } from "./knowledge.dto";

export class KnowledgeController {
  constructor(
    private readonly createKnowledgeUseCase: KnowledgeCreateUseCase,
    private readonly listDocumentsUseCase: KnowledgeListUseCase,
  ) {}

  createDocument = async (
    request: FastifyRequest<{ Body: CreateKnowledgeDocumentDTO }>,
  ) => {
    return this.createKnowledgeUseCase.execute(request.body);
  };

  listDocuments = async () => {
    return this.listDocumentsUseCase.execute();
  };
}

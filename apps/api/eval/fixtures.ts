import { KnowledgeIngestionUseCase } from "../src/modules/knowledge/knowledge.ingestion.usecase";

export async function seedKnowledge(
  knowledgeIngestionUseCase: KnowledgeIngestionUseCase,
) {
  await knowledgeIngestionUseCase.execute({
    title: "Политика возврата",
    content: "Возврат товара возможен в течение 14 дней с момента покупки.",
  });

  await knowledgeIngestionUseCase.execute({
    title: "Доставка",
    content: "Стандартная доставка занимает от 2 до 5 рабочих дней.",
  });

  await knowledgeIngestionUseCase.execute({
    title: "Оплата",
    content: "Оплата возможна картой и через СБП.",
  });
}

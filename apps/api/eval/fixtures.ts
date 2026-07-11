import { AppContainer } from "../src/bootstrap/createContainer";

export async function seedKnowledge(container: AppContainer) {
  await container.knowledgeIngestionUseCase.execute({
    title: "Политика возврата",
    content: "Возврат товара возможен в течение 14 дней с момента покупки.",
  });

  await container.knowledgeIngestionUseCase.execute({
    title: "Доставка",
    content: "Стандартная доставка занимает от 2 до 5 рабочих дней.",
  });

  await container.knowledgeIngestionUseCase.execute({
    title: "Оплата",
    content: "Оплата возможна картой и через СБП.",
  });
}

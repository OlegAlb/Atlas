import { ChatUseCase } from "./chat.usecase";
import { ChatRequestDTO } from "./chat.dto";

export class ChatController {
  constructor(private readonly useCase: ChatUseCase) {}

  async chat(body: ChatRequestDTO) {
    return this.useCase.execute(body);
  }
}

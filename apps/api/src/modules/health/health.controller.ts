import { HealthUseCase } from "./health.usecase";

export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCase) {}

  getHealth = async () => {
    return this.healthUseCase.execute();
  };
}

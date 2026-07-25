import { HealthUseCase } from "../../application/health/health.usecase";

export class HealthController {
  constructor(private readonly healthUseCase: HealthUseCase) {}

  getHealth = async () => {
    return this.healthUseCase.execute();
  };
}

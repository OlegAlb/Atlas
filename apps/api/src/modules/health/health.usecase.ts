export class HealthUseCase {
  execute() {
    return {
      status: "ok",
      service: "atlas-api",
    };
  }
}
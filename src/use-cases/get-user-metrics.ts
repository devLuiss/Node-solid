import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    // verify if user already checkin in the same day
    const checkInsCount = await this.CheckInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}

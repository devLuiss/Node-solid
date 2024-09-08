import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";

interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInHistoryUseCaseResponse {
  checkIn: CheckIn[];
}

export class FetchUserCheckInHistoryUseCase {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
    // verify if user already checkin in the same day
    const checkIns = await this.CheckInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIn: checkIns,
    };
  }
}

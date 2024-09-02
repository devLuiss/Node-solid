import { ResourceNotFoundError } from "@/use-cases/errors/resource-note-found-error";
import { User } from "@prisma/client";
import { UsersRepository } from "src/repositories/users-repository";

interface getUserProfileRequest {
  userId: string;
}

interface getUserProfileResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: getUserProfileRequest): Promise<getUserProfileResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}

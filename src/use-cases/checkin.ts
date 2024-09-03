import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-note-found-error";
import { getDistanceBtwCoordinates } from "@/utils/get-distance-btw-coordinates";
import { CheckIn } from "@prisma/client";
import { GymsRepository } from "./../repositories/gyms-repository";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: Number;
  userLongitude: Number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private CheckInsRepository: CheckInsRepository,
    private GymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // verify if user already checkin in the same day
    const gym = await this.GymsRepository.findById(gymId);
    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // calcule distance between user and gym
    // if distance is greater than 100m, throw error "User is too far from gym"

    const distance = getDistanceBtwCoordinates(
      {
        latitude: Number(userLatitude),
        longitude: Number(userLongitude),
      },
      {
        latitude: Number(gym.latitude),
        longitude: Number(gym.longitude),
      }
    );
    const gymFromUserMaxDistance = 0.1;
    console.log(distance);

    if (distance > gymFromUserMaxDistance) {
      throw new Error();
    }

    const checkInSameDay = await this.CheckInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInSameDay) {
      throw new Error("User already checked in today");
    }

    const checkIn = await this.CheckInsRepository.create({
      user_Id: userId,
      gym_Id: gymId,
    });

    return {
      checkIn,
    };
  }
}

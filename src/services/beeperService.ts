import NewBeeperDTO from "../DTO/newBeeperDto"
import { getFileData, saveFileData } from "../config/fileDataLayer"
import Beeper from "../models/beeper"
import { Status } from "../utils/statusEnum"
import { validLocations } from "../utils/validLocations "

export default class beeperService {
  private static statusLifecycle = [
    Status.manufactured,
    Status.assembled,
    Status.shipped,
    Status.deployed,
    Status.detonated,
  ]

  private static async isValidStatusTransition(
    currentStatus: Status,
    newStatus: Status
  ): Promise<boolean> {
    const currentIndex = this.statusLifecycle.indexOf(currentStatus)
    const newIndex = this.statusLifecycle.indexOf(newStatus)
    return newIndex === currentIndex + 1
  }

  private static async isValidLocation(
    latitude: number,
    longitude: number
  ): Promise<boolean> {
    return validLocations.some(
      (loc) => loc.latitude === latitude && loc.longitude === longitude
    )
  }

  public static async getAllBeepers(): Promise<Beeper[]> {
    return ((await getFileData<Beeper>("beepers")) as Beeper[]) || []
  }

  public static async createNewBeeper(
    newBeeper: NewBeeperDTO
  ): Promise<boolean> {
    const { name, latitude, longitude } = newBeeper
    const beeper: Beeper = new Beeper(name, latitude, longitude)

    let beepers: Beeper[] = (await getFileData<Beeper>("beepers")) as Beeper[]
    if (!beepers) beepers = []

    beepers.push(beeper)
    return await saveFileData<Beeper>("beepers", beepers)
  }

  public static async getBeeperById(id: number): Promise<Beeper | null> {
    const beepers = await this.getAllBeepers()
    return beepers.find((beeper) => beeper.id === id) || null
  }

  public static async deleteBeeper(id: number): Promise<boolean> {
    const beeper = await this.getBeeperById(id)
    if (!beeper) return false

    let beepers = await this.getAllBeepers()
    const filteredBeepers = beepers.filter((beeper) => beeper.id !== id)
    return await saveFileData<Beeper>("beepers", filteredBeepers)
  }

  public static async getBeepersByStatus(status: Status): Promise<Beeper[]> {
    const beepers = await this.getAllBeepers()
    return beepers.filter((beeper) => beeper.status === status)
  }

  public static async updateBeeperStatus(
    beeperId: number,
    newStatus: Status,
    latitude?: number,
    longitude?: number
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const beeper = await this.getBeeperById(beeperId)
      if (!beeper) {
        return { success: false, message: "Beeper not found" }
      }

      if (!(await this.isValidStatusTransition(beeper.status, newStatus))) {
        return { success: false, message: "Invalid status transition" }
      }

      beeper.status = newStatus

      if (newStatus === Status.deployed) {
        if (!latitude || !longitude) {
          return {
            success: false,
            message: "Latitude and longitude are required for deployed status",
          }
        }

        if (!(await this.isValidLocation(latitude, longitude))) {
          return { success: false, message: "Invalid location for deployment" }
        }

        beeper.latitude = latitude
        beeper.longitude = longitude

        console.log(
          `Setting timeout to detonate beeper ${beeperId} in 10 seconds`
        )
        setTimeout(async () => {
          console.log(`Timeout reached, detonating beeper ${beeperId}`)
          await this.detonateBeeper(beeperId)
        }, 10000)
      }

      let beepers = await this.getAllBeepers()
      const updatedBeepers = beepers.map((b) =>
        b.id === beeperId ? beeper : b
      )
      await saveFileData<Beeper>("beepers", updatedBeepers)

      return {
        success: true,
        message: "Beeper status updated successfully",
        data: beeper,
      }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An unexpected error occurred" }
    }
  }

  private static async detonateBeeper(beeperId: number): Promise<void> {
    console.log(`Detonating beeper ${beeperId}`)

    const beeper = await this.getBeeperById(beeperId)
    if (!beeper) {
      throw new Error("Beeper not found")
    }
    beeper.status = Status.detonated
    beeper.detonated_at = new Date()
    let beepers = await this.getAllBeepers()
    const updatedBeepers = beepers.map((b) => (b.id === beeperId ? beeper : b))
    await saveFileData<Beeper>("beepers", updatedBeepers)
    console.log(`Beeper ${beeperId} status updated to detonated`)
  }
}

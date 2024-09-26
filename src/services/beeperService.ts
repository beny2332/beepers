import NewBeeperDTO from "../DTO/newBeeperDto"
import { getFileData, saveFileData } from "../config/fileDataLayer"
import Beeper from "../models/beeper"

export default class beeperService {
  public static async getAllBeepers(): Promise<Beeper[]> {
    return ((await getFileData<Beeper>("beepers")) as Beeper[]) || []
  }

  public static async createNewBeeper(newBeeper: NewBeeperDTO): Promise<boolean> {
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
    const filteredBeepers = beepers.filter(beeper => beeper.id !== id)
    return await saveFileData<Beeper>("beepers", filteredBeepers)
  }
}

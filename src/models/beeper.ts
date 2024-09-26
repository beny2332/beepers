import { Status } from "../utils/statusEnum"

class Beeper {
  public id: number
  public status: Status
  public created_at: Date
  public detonated_at?: Date

  constructor(
    public name: string,
    public latitude?: number,
    public longitude?: number
  ) {
    this.id = +Math.random().toString().split(".")[1]
    this.created_at = new Date()
    this.status = Status.manufactured;
  }
}

export default Beeper
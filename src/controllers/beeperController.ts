import exp, { Router, Request, Response } from "express"
import beeperService from "../services/beeperService"
import NewBeeperDTO from "../DTO/newBeeperDto"
import { Status } from "../utils/statusEnum"
const router: Router = exp.Router()

// Get all beepers
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const beepers = await beeperService.getAllBeepers()
    res.status(200).json({
      err: false,
      message: "Beepers retrieved successfully",
      data: beepers,
    })
  } catch (err) {
    res.status(400).json({
      err: true,
      message: "Failed to retrieve beepers",
      data: null,
    })
  }
})

// Create a new beeper
router.post(
  "/",
  async (
    req: Request<any, any, NewBeeperDTO>,
    res: Response
  ): Promise<void> => {
    try {
      const result = await beeperService.createNewBeeper(req.body)
      if (result) {
        res.status(200).json({
          err: false,
          message: `${req.body.name} was created successfuly`,
          data: undefined,
        })
      } else {
        throw new Error("Can't save new beeper")
      }
    } catch (err) {
      res.status(400).json({
        err: true,
        message: err || "Failed to create new beeper",
        data: null,
      })
    }
  }
)

// Update beeper status by id
router.put(
  "/:id/status",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const beeperId = Number(req.params.id)
      const { status, latitude, longitude } = req.body
      const result = await beeperService.updateBeeperStatus(
        beeperId,
        status,
        latitude,
        longitude
      )
      if (result.success) {
        res.status(200).json({
          err: false,
          message: result.message,
          data: result.data,
        })
      } else {
        res.status(400).json({
          err: true,
          message: result.message,
          data: null,
        })
      }
    } catch (err) {
      res.status(500).json({
        err: true,
        message: "Failed to update beeper status",
        data: null,
      })
    }
  }
)

// Delete beeper by id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await beeperService.deleteBeeper(Number(req.params.id))
    if (deleted) {
      res.status(200).json({
        err: false,
        message: "Beeper deleted successfully",
        data: undefined,
      })
    } else {
      res.status(404).json({
        err: true,
        message: "Beeper not found",
        data: null,
      })
    }
  } catch (err) {
    res.status(400).json({
      err: true,
      message: "Failed to delete beeper",
      data: null,
    })
  }
})

// Get beeper by id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const beeper = await beeperService.getBeeperById(Number(req.params.id))
    if (beeper) {
      res.status(200).json({
        err: false,
        message: "Beeper retrieved successfully",
        data: beeper,
      })
    } else {
      res.status(404).json({
        err: true,
        message: "Beeper not found",
        data: null,
      })
    }
  } catch (err) {
    res.status(400).json({
      err: true,
      message: "Failed to retrieve beeper",
      data: null,
    })
  }
})

// Get beepers by status 
router.get(
  "/status/:status",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.params.status as keyof typeof Status
      if (!Status[status]) {
        res.status(400).json({
          err: true,
          message: "Invalid status",
          data: null,
        })
        return
      }
      const beepers = await beeperService.getBeepersByStatus(Status[status])
      res.status(200).json({
        err: false,
        message: "Beepers retrieved successfully",
        data: beepers,
      })
    } catch (err) {
      res.status(400).json({
        err: true,
        message: "Failed to retrieve beepers",
        data: null,
      })
    }
  }
)

export default router

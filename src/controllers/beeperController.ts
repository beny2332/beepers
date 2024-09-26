import exp, { Router, Request, Response } from "express"
import beeperService from "../services/beeperService"
import NewBeeperDTO from "../DTO/newBeeperDto"
const router: Router = exp.Router()

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

router.put(
  "/:id/status",
  async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        err: false,
        message: "Beepers retrieved successfully",
        data: undefined,
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
        message: "Failed to delete post",
        data: null,
      })
    }
  })


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
router.get(
  "/status/:status",
  async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        err: false,
        message: "Beepers retrieved successfully",
        data: undefined,
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

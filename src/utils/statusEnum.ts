export enum Status {
  manufactured = "manufactured",
  assembled = "assembled",
  shipped = "shipped",
  deployed = "deployed",
  detonated = "detonated",
}

export const statusLifecycle = [
    Status.manufactured,
    Status.assembled,
    Status.shipped,
    Status.deployed,
    Status.detonated,
  ]

import fs from "fs/promises"

export const getFileData = async <T>(resource: string): Promise<T[] | void> => {
  try {
    const strData: string = await fs.readFile(
      `${__dirname}/../../data/${resource}.json`,
      "utf8"
    )
    const parsedData: T[] = JSON.parse(strData)
    return parsedData
  } catch (err) {
    console.log(err)
  }
}

export const saveFileData = async <T>(
  resource: string,
  data: T[]
): Promise<boolean> => {
  try {
    const stringifiedData: string = JSON.stringify(data, null, 2)
    await fs.writeFile(`${__dirname}/../../data/${resource}.json`, stringifiedData, {
      encoding: "utf8",
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

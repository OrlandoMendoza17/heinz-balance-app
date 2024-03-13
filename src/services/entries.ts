import axios from "axios"

type Params = {
  entry: unknown,
  entryByDestination: unknown,
}

export const createNewEntry = async (body: Params) => {
  const { data } = await axios.post("/api/entries", body)
  return data
}
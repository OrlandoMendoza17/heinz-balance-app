import { NewEntry } from "@/components/pages/VehiculesEntrance"
import axios from "axios"

type Params = {
  entry: NewEntry,
  entryByDestination: object,
}

export const createNewEntry = async (body: Params) => {
  const { data } = await axios.post("/api/entries", body)
  return data
}

export const getNextEntryNumber = async () => {
  const { data } = await axios.get<{ nextEntryNumber: string }>("/api/nextEntry")
  return data
}
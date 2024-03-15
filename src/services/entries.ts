import { NewEntry } from "@/components/pages/VehiculesEntrance"
import { NewExit } from "@/components/pages/VehiculesExit"
import axios from "axios"

type newEntryParams = {
  entry: NewEntry,
  entryByDestination: object,
}

type newExitParams = {
  leavingEntry: NewExit,
  updateEntryByDestination: object | undefined,
}

export const createNewEntry = async (body: newEntryParams) => {
  const { data } = await axios.post("/api/entries/newEntry", body)
  return data
}

export const createNewExit = async (body: newExitParams) => {
  const { data } = await axios.post("/api/entries/newExit", body)
  return data
}

export const getNextEntryNumber = async () => {
  const { data } = await axios.get<{ nextEntryNumber: string }>("/api/entries/nextEntry")
  return data
}

export const getTodaysExits = async () => {
  const { data } = await axios.get<P_SAL[]>("/api/entries/todaysExits")
  return data;
}
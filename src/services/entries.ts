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

type EntriesType = "entry" | "initial" | "dispatch" | "aboutToLeave" | "all"

export const getEntriesInPlant = async () => {
  const { data } = await axios.get<Entry[]>("/api/entries/inPlant")
  return data;
}

export const createNewEntry = async (body: newEntryParams) => {
  const { data } = await axios.post("/api/entries/newEntry", body)
  return data;
}

export const createNewExit = async (body: newExitParams) => {
  const { data } = await axios.post("/api/entries/newExit", body)
  return data;
}

export const getNextEntryNumber = async () => {
  const { data } = await axios.get<{ nextEntryNumber: string }>("/api/entries/nextEntry")
  return data;
}

export const getTodaysExits = async () => {
  const { data } = await axios.get<P_SAL[]>("/api/entries/todaysExits")
  return data;
}

export const getDistEntries = async (entriesType: EntriesType) => {
  const { data } = await axios.post<P_ENT_DI[]>("/api/entries/distribution", { entriesType, formatted: false })
  return data;
}

export const getFormattedDistEntries = async (entriesType: EntriesType) => {
  const { data } = await axios.post<Entry[]>("/api/entries/distribution", { entriesType, formatted: true })
  return data;
}

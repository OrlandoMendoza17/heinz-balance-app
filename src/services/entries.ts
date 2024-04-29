import axios from "axios"
import { NewEntry } from "@/utils/getTableValues"
import base_url from "."

type NewEntryParams = {
  entry: NewEntry,
  entryByDestination: object,
}

export type EntriesType = "entry" | "initial" | "dispatch" | "aboutToLeave" | "all"

export const getEntry = async (entryNumber: P_ENT["ENT_NUM"]) => {
  const { data } = await axios.post<P_ENT[]>(`${base_url}/api/entries`, { entries: [entryNumber] })
  return data[0];
}

export const createNewEntryDifference = async (entryDif: Omit<P_ENT_DIF, "ENT_DIF_NUM">) => {
  const { data } = await axios.post(`${base_url}/api/entries/entryDif`, { entryDif })
  return data;
}

export const getEntryDifference = async (entryNumber: P_ENT_DI["ENT_NUM"]) => {
  const { data } = await axios.get<EntryDif>(`${base_url}/api/entries/entryDif`, { params: { entryNumber } })
  return data;
}

export const createNewEntry = async (body: NewEntryParams) => {
  const { data } = await axios.post(`${base_url}/api/entries/newEntry`, body)
  return data;
}

export const updateEntry = async (entryNumber: P_ENT["ENT_NUM"], entry: UpdateP_ENT) => {
  const { data } = await axios.post<{ message: string }>(`${base_url}/api/entries/updateEntry`, { entryNumber, entry })
  return data;
}

export const getEntriesInPlant = async () => {
  let { data: exits } = await axios.get<Exit[]>(`${base_url}/api/entries/inPlant`)
  exits = exits.map(({ entryDate, ...rest }) => (
    {
      ...rest,
      entryDate: entryDate.replace("T", " ").replace("Z", "")
    }
  ))
  return exits;
}

export const getNextEntryNumber = async () => {
  const { data } = await axios.get<{ nextEntryNumber: P_ENT["ENT_NUM"] }>(`${base_url}/api/entries/nextEntry`)
  return data.nextEntryNumber;
}

export const getDistEntries = async (entriesType: EntriesType) => {
  const { data } = await axios.post<P_ENT_DI[]>(`${base_url}/api/entries/distribution`, { entriesType, formatted: false })
  return data;
}

export const getFormattedDistEntries = async (entriesType: EntriesType) => {
  let { data: entries } = await axios.post<DistributionEntry[]>(`${base_url}/api/entries/distribution`, { entriesType, formatted: true })
  entries = entries.map(({ entryDate, ...rest }) => (
    {
      ...rest,
      entryDate: entryDate.replace("T", " ").replace("Z", "")
    }
  ))
  return entries;
}


export const updateDistEntry = async (distEntry: P_ENT_DI) => {
  const { data } = await axios.post<{ message: string }>("/api/entries/updateDistEntry", { distEntry })
  return data;
}
import axios from "axios"
import base_url from ".";

export const sendEmail = async (distEntry: DistributionEntry, entryDif: EntryDif) => {
  await axios.post(`${base_url}/api/correo`, { distEntry, entryDif })
}
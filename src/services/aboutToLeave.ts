import axios from "axios"

const getAboutToLeaveEntries = async () => {
  const { data } = await axios.get<Entry[]>("/api/aboutToLeave")
  return data;
}

export default getAboutToLeaveEntries;
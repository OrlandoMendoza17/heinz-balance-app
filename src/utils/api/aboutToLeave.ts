import { DESTINATION_TABLES } from "@/lib/enums"

const getDestinationEntryQuery = (destinationCode: DES_COD, ENT_NUM: P_ENT["ENT_NUM"]) => {
  
  const queryString = `
    SELECT * FROM [HDTA025].[dbo].[H025_P_${DESTINATION_TABLES[destinationCode]}] 
    WHERE ENT_NUM IN (${ENT_NUM})
  `
  
  return queryString
}

export default getDestinationEntryQuery;
export const splitString = (entryDetails: string) => {
  let details = ""

  const chunkLength = 40
  const limit = Math.ceil(entryDetails.length / chunkLength)

  for (let index = 0; index < limit; index++) {
    details += `${`${entryDetails.slice(chunkLength * index, (chunkLength * index) + chunkLength)}`.trim()}\n`
  }
  
  return details;
}
const XLSX = require('../../../node_modules/xlsx/xlsx.js')

const generateExcel = (exitDifferences: Exit[]) => {
  const formatted = exitDifferences.map((exit) => {

    const { driver, vehicule } = exit;

    return (exit.entryDifference as EntryDif[]).map((difference) => {

      const { entryNumber, entryDifferenceNumber, entryDifferenceDate, aditionalWeight } = difference
      const { palletWeight, calculatedNetWeight, truckWeight, weightDifference, grossWeight } = difference

      return ({
        "N° DE ENTRADA": entryNumber,
        "N° DE DIFERENCIA": entryDifferenceNumber,
        "FECHA DE DIFERENCIA": entryDifferenceDate,
        "NOMBRE DEL CHOFER": driver.name,
        "CEDULA DEL CHOFER": driver.cedula,
        "PLACA DEL VEHÍCULO": vehicule.plate,
        "PESO ADICIONAL": aditionalWeight,
        "PESO DE PALETA": palletWeight,
        "PESO NETO CALCULADO": calculatedNetWeight,
        "TARA": truckWeight,
        "DIFERENCIA DE PESO": weightDifference,
        "PESO BRUTO": grossWeight,
      })
    })

  }).flat()

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(formatted)

  XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1")
  XLSX.writeFile(workbook, `Diferencia de peso.xlsx`)
}

export default generateExcel;
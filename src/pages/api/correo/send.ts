import sequelize from '@/lib/mssql';
import { getInsertAttributes } from '@/utils/api/insert';
import type { NextApiRequest, NextApiResponse } from 'next';
// import { Resend } from 'resend';

// const resend = new Resend("re_CKDoYsDC_79JA5H3UNK2t6rX3SkcWe4fN");

type BodyProps = {
  distEntry: DistributionEntry,
  entryDif: EntryDif
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  try {

    const { distEntry, entryDif }: BodyProps = request.body
    
    const balanceReport: BalanceReport = {
      ENT_NUM: entryDif.entryNumber,
      ENT_DIF_NUM: entryDif.entryDifferenceNumber,
      CON_NOM: distEntry.driver.name,
      CON_CED: distEntry.driver.cedula,
      VEH_PLA: distEntry.vehicule.plate,
      ENT_DI_PLA: distEntry.chargePlan,
      ENT_DI_DES: distEntry.chargeDestination,
      ENT_DI_PNC: entryDif.calculatedNetWeight,
      ENT_PES_TAR: entryDif.truckWeight,
      SAL_PES_BRU: entryDif.grossWeight,
      ENT_DI_PAD: entryDif.aditionalWeight,
      DIF_PES: entryDif.weightDifference,
      ENT_DI_CPA: distEntry.palletsQuatity,
      ENT_DI_PPA: entryDif.palletWeight,
      ENT_DI_OBS: distEntry.distDetails,
      ENT_DIF_FEC: entryDif.entryDifferenceDate,
    }
    
    const [keys, values] = getInsertAttributes(balanceReport)
    
    const queryString = `
      INSERT Report_Balanza_temp\n${keys} 
      VALUES ${values}
    `
    // const TRUNCATE_TABLE_QUERY = `
    //   TRUNCATE TABLE Report_Balanza_temp
    // `
    
    await sequelize.query(queryString)
    // await sequelize.query(TRUNCATE_TABLE_QUERY)
   
    response.status(201).json({
      message: "SUCCESSFUL INSERT"
    });

  } catch (error) {
    return response.status(500).json(error);
  }
};
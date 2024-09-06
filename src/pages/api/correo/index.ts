// import getSequelize from "@/lib/mssql";
import sequelize from "@/lib/mssql";
import { NextApiRequest, NextApiResponse } from "next";

type BodyProps = {
  distEntry: DistributionEntry,
  entryDif: EntryDif
}

const modelsHandler = async (request: NextApiRequest, response: NextApiResponse) => {

  const { distEntry, entryDif }: BodyProps = request.body

  const { entryNumber, vehicule, driver, chargePlan, aditionalWeightDescription } = distEntry
  const { chargeDestination, calculatedNetWeight, palletsQuatity, palletWeight  } = distEntry
  const { entryDifferenceNumber, weightDifference, truckWeight, grossWeight, aditionalWeight } = entryDif

  try {
    //Consulta sql
    const queryString = `
      DECLARE @Html varchar(max) = '';
      DECLARE @Asunto varchar(max) = '';
      
      SELECT @Asunto = ('Reporte de Auditorías')
      
      SET @Html=''			  
      SET @Html = @Html + '<html>'
      SET @Html = @Html + '<body>'
      SET @Html = @Html + '<h1>Reporte de diferencias<h1/>'
      
      SET @Html = @Html + '<h2>Número de Entrada:<h2/> 98254'
      SET @Html = @Html + '<h2>Número de Diferencia:<h2/> 9878'
      SET @Html = @Html + '<h2>Conductor:<h2/> FRANKIN MARTINEZ'
      SET @Html = @Html + '<h2>Placa de Vehículo:<h2/> A93AC5G'
      SET @Html = @Html + '<h2>Plan de Carga:<h2/> 127545'
      SET @Html = @Html + '<h2>Destino de Carga:<h2/> CORO'
      SET @Html = @Html + '<h2>Peso Neto Calculado:<h2/> 18128,74'
      SET @Html = @Html + '<h2>Peso de Entrada:<h2/> 17410'
      SET @Html = @Html + '<h2>Peso de Bruto:<h2/> 35960'
      SET @Html = @Html + '<h2>Peso Adicional:<h2/> 0'
      SET @Html = @Html + '<h2>Diferencia de Peso:<h2/> -298,74'
      SET @Html = @Html + '<h2>Cantidad de Paletas:<h2/> 24'
      SET @Html = @Html + '<h2>Peso de Paletas:<h2/> 30'
      SET @Html = @Html + '<h2>Descripción del Peso adicional:<h2/> Lorem Ipsum....'
      
      SET @Html = @Html + '<body/>'
      SET @Html = @Html + '<html/>'
      
      EXEC msdb.dbo.sp_send_dbmail 
        @profile_name='Mail_Pedidos', 
        @recipients='',
        --@recipients='dg-am-sjq-sopapl@ve.hjheinz.com;',
        --@recipients=@CorreoTO,
        --@copy_recipients ='',
        @blind_copy_recipients= 'orlando.mendoza@kraftheinz.com; yamileth.mujica@kraftheinz.com',
      
        --@blind_copy_recipients= 'Andres.Gomez@kraftheinz.com ; Wilmer.Rincon@kraftheinz.com; Nelson.Gomez@kraftheinz.com; Daniel.Marin@kraftheinz.com ; Julian.Coronil@kraftheinz.com; Yamileth.Mujica@kraftheinz.com; Dhameliz.Diaz@kraftheinz.com; Howie.Rodriguez1@kraftheinz.com',
      
        @subject= @Asunto, 
        @body_format = 'HTML',
        @body = @Html
      ;
    `

    // const sequelize = await getSequelize()
    //Ejecucion de la consulta 
    const [data] = await sequelize.query(queryString) as [T_MAT[], unknown]

    //Devolver los resultados de la consulta en la respuesta
    response.json(data)

  } catch (error) {
    response.status(500).json({
      error,
      message: "There has been an error in the server"
    })
  }
}

export default modelsHandler;
import { useEffect } from "react";

enum ROL {
  ADMIN = "01",
  SUPERVISOR_BALANZA = "02",
  USER_BALANZA = "03",
  USER_TRANSPORT = "04",
  USER_FACTURACION = "05",
  USER_DESPACHO = "06",
}

const APP_FEATURE = {
  "01": [""],
  "02": ["BALANZA", "BALANZA_EDIT_WEIGHT"],
  "03": [""],
  "04": [""],
  "05": [""],
  "06": [""],
}

type RolKeyAccess = "01" | "02" | "03" | "04" | "05" | "06"
type Feature = "BALANZA" | "BALANZA_EDIT_WEIGHT" | "DESPACHO" | "FACTURACION"

const getAccess = (KEY_ACCESS: RolKeyAccess, feature: Feature) => {
  if (KEY_ACCESS === ROL.ADMIN) {
    return true;
  }else{
    return APP_FEATURE[KEY_ACCESS].includes(feature)
  }
}

// type User1 = {
//   rol: RolKeyAccess
// }

// const user: User1 = {
//   rol: "01",
// }

// const access = getAccess(user.rol, "BALANZA")

// const GETACCESS = () => {
//   useEffect(()=>{
//     const access = getAccess(user.rol, "DESPACHO")
//     if(!access){
//       // Mandame pal carajo
//     }
//   },[])
  
//   return (
//     <main>
//       {
//         getAccess(user.rol, "BALANZA") && 
//         <div></div>
//       }
//     </main>
//   )
// }
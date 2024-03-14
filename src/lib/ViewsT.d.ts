
// Trasporte al que pertenecen los conductores
type VW_CON = {
    trasporte: string;
    cedula: number;
    nombre: string;
}

// Vistas de auditorias 

type DI_AUD = {
    FECHAENTRADA: Date;
    FECHADISTRIBUCION: Date;
    PROCEDENCIA: string;
    DESTINO: string;
    PLANDECARGA: string;
    NUMEROGUIA: number;
    NOTADESPACHO: number;
    PESOENTRADA: number;
    PESONETOTEORICO: number;
    PESOADICONALTEORICO: number;
    PESOPALETA: number;
    CANTIDADPALETA: number;
    DosPorcentajePESONETO: number;
    MenosDosPorcentajePesoNeto: number;
    MasDosPorcentajePesoNeto: number;
    PESOAPROXCARGAPESOENTRADATEORICO: number;
    PESONETO: number;
    PESOSALIDA: number;
    MenosPesoTeoricoSalida: number;
    MasPesoTeoricoSalida: number;
    DPA: string;
    ESTATUSDISTRIBUCION: number;
    AUDITORIADISTRIBUCION: number;
    NUMEROPALETA: number;
    OBSERVACIONESDISTRIBUCION: string;
    REVISIONENDISTRIBUCION: number;// Siempre 0
    CODIGOVEHICULO: number;
    PLACAVEHICULO: string;
    CAPACIDADVEHICULO: number;
    CEDULACHOFER: string;
    NOMBRECHOFER: string;
    FECHACOL: date;
}



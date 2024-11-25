
// Trasporte al que pertenecen los conductores
type VW_CON = {
    trasporte: string;
    cedula: number;
    nombre: string;
}

// Vistas de auditorias 
type VW_DI_AU = {
    codigoEntrada:                    string;
    usuario:                          Usuario;
    fechaEntrada:                     Date;
    fechaDistribucion:                Date;
    procedencia:                      string;
    destino:                          string;
    planDeCarga:                      string;
    numeroGuia:                       string;
    notaDespacho:                     string;
    pesoEntrada:                      number;
    pesoNetoTeorico:                  number;
    pesoAdiconalTeorico:              number;
    pesoPaleta:                       number;
    cantidadPaleta:                   number;
    purple2PESONETO:                  number;
    pokedex2PESONETO:                 number;
    the2PesoNeto:                     number;
    pesoAproxCargaPesoEntradaTeorico: number;
    pesoNeto:                         number;
    pesoSalida:                       number;
    pokedexPESOTEORICOSALIDA:         number;
    pesoTeoricoSalida:                number;
    dpa:                              null | string;
    estatusDistribucion:              number;
    auditoriaDistribucion:            null | string;
    numeroPaleta:                     null | string;
    observacionesDistribucion:        null | string;
    revisionEnDistribucion:           boolean;
    codigoVehiculo:                   string;
    placaVehiculo:                    string;
    capacidadVehiculo:                number;
    cedulaChofer:                     string;
    nombreChofer:                     string;
    fechaCol:                         Date | null;
}

type VW_DI_AUD_VIEW = {
    codigoDiferencia:                 string;
    codigoEntrada:                    string;
    usuarioProcesoDiferencia:         UsuarioProcesoDiferencia;
    fechaEntrada:                     Date;
    fechaDistribucion:                Date;
    fechaDiferencia:                  Date;
    procedencia:                      string;
    destino:                          string;
    planDeCarga:                      string;
    numeroGuia:                       string;
    notaDespacho:                     string;
    pesoEntrada:                      number;
    pesoNetoTeorico:                  number;
    pesoAdiconalTeorico:              number;
    pesoPaleta:                       number;
    cantidadPaleta:                   number;
    pesoTotalPaleta:                  number;
    pesoAproxCargaTeorico:            number;
    pesoNetoRomana:                   number;
    purple2PESONETO:                  number;
    pokedex2PESONETO:                 number;
    the2PesoNeto:                     number;
    pesoAdicionalRomana:              number;
    pesoAproxCargaPesoEntradaTeorico: number;
    pokedexPESOTEORICOSALIDA:         number;
    pesoTeoricoSalida:                number;
    pesoSalidaRomana:                 number;
    diferenciaDePeso:                 number;
    dpa:                              null | string;
    estatusDistribucion:              number;
    auditoriaDistribucion:            null | string;
    numeroPaleta:                     null | string;
    observacionesDistribucion:        null | string;
    revisionEnDistribucion:           boolean;
    codigoVehiculo:                   string;
    placaVehiculo:                    string;
    capacidadVehiculo:                number;
    cedulaChofer:                     string;
    nombreChofer:                     string;
    fechaCol:                         Date | null;
}

export type VW_DIF_LAST = {
    entDIFNum: string;
    entNum:    string;
    entDIFFEC: Date;
    entPesTar: number;
    entDiPnc:  number;
    salPesBru: number;
    entDiPad:  number;
    entDiPpa:  number;
    difPes:    number;
    usuLog:    UsuLog;
}

type VW_ENT = {
    codigo:       string;
    transporte:   string;
    placa:        string;
    nombre:       string;
    cedula:       string;
    fechaEntrada: Date;
    pesoEntrada:  number;
}

export type VW_ENT_ALL = {
    codigo:        string;
    fechaEntrada:  Date;
    loginUsuario:  LoginUsuario;
    placa:         string;
    cedula:        string;
    codDestino:    CodDestino;
    codOperacion:  CodOperacion;
    pesoTara:      number;
    idEmpleado:    null;
    observaciones: null | string;
    workflow:      number;
    accion:        number;
}

export type VW_ENT_DES = {
    codigo:       string;
    transporte:   string;
    placa:        string;
    nombre:       string;
    cedula:       string;
    fechaEntrada: Date;
    destino:      Destino;
}

export type VW_ENT_DI = {
    codigo:       string;
    transporte:   string;
    placa:        string;
    nombre:       string;
    cedula:       string;
    fechaEntrada: Date;
    pesoEntrada:  number;
}

export type VW_ENT_DI_ENT = {
    entNum: string;
    entFEC: Date;
    conNom: string;
    vehPla: string;
    traNom: string;
}

export type VW_ENT_HOY = {
    entNum: string;
    entFEC: Date;
    conNom: string;
    vehPla: string;
    traNom: string;
}

export type VW_ENT_NOT_SAL= {
    codigo:               string;
    transporte:           string;
    placa:                string;
    cedula:               string;
    nombre:               string;
    destino:              Destino;
    fechaEntrada:         Date;
    fechaSalida:          Date;
    pesoEntrada:          number;
    pesoNeto:             number;
    pesoSalida:           number;
    pesoLitros:           number;
    observacionesEntrada: ObservacionesEntrada;
    observacionesSalida:  string;
}


  

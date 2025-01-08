export interface ValidacaoCliente {
    cliente_existe: boolean
    primeiro_acesso: boolean
}

export interface RespostaEmail {
    resultado: string
}

export interface RespostaValidacao {
    resultado: string
}

export interface RespostaDANFe{
    arquivo: string
}

export interface RespostaApiBoleto {
    pix: string,
    codbarras: string,
    arquivo: string
}

interface RespostaTitulos {
    Titulo: number,
    Parcela: string,
    Empresa: number,
    serie_nf: string,
    Cod_Cliente: number,
    cod: number,
    nome: string,
    CNPJ_CPF_Credor: number,
    IE_RG_Credor: string,
    Cidade: string,
    UF: string,
    Razao_Social: string,
    Endereco: string,
    Num: number,
    Bairro: string,
    CEP: number,
    Tel1: number,
    eMail: string,
    Carteira: string,
    Vencimento: string,
    Valor_Original: number,
    Valor_receber: string,
    Ocorrencia: any,
    nosso_numero: number,
    CodBanco: number,
    RazaoSocialCedente: string,
    CNPJCedente: number,
    EnderecoCedente: string,
    NumCedente: string,
    BairroCedente: string,
    CEPCedente: number,
    UFCedente: string,
    MunicipioCedente: string,
    Agencia: number,
    DigitoAgencia: number,
    CarteiraBanco: number,
    ContaBanco: number,
    DigitoContaBanco: string,
    CodigoCedenteConvenio: number,
    EnviadoCartorio: boolean
}

export interface ApiRespostaTitulos {
    result: RespostaTitulos[][];
}

interface RespostaInfoCliente{
    cod: number,
    nome: string,
    Razao_Social: string,
    CNPJ_CPF_Credor: number,
    eMail: string,
    Endereco: string,
    Bairro: string,
    CEP: number,
    Cidade: string,
    UF: string,
    Tel1: number,
    PermiteAmostraFisica: boolean
}

export interface ApiRespostaInfoCliente {
    result: RespostaInfoCliente[][];
}
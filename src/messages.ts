export const MakeInvalidFileMessage = ( types:string[], limit: number ) => {
    const list = types.map(t=>(` .${t.substring(t.lastIndexOf("/")+1, t.length )}`)) 
    const limitMb = (limit / (1024 * 1024 )).toFixed(3);
    const message = `Somente arquivos (${ list} ) com tamanho maximo de ${limitMb} Mb.`
    return message
}

export const MakeMissingFileMessage = ( key:string ) => {
    return `Não foi encontrado um arquivo válido `
}

export const MakeFileLengthExceed = (n: number) => {
    return `Não é permitido mais que ${n} Arquivo${n > 1 ? 's' : ''}`
}

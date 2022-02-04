import { Request , Response } from 'express'
import { FormDataParser } from "../protocols";

const FILE_ERROR_NAME = "InvalidFilesError"
const INVALID_CONTENT_TYPE = "Conteúdo invalido para essa operação"

export class FileError extends Error {
     params: FormDataParser.Conflicts;
     constructor(params: FormDataParser.Conflicts){
          super("Existem Pendencias nos arquivos exigidos para essa operação")
          this.params = params
          this.name = FILE_ERROR_NAME
          Object.setPrototypeOf(this, FileError.prototype);
     }
} 

export class ExpressFormDataParserAdapter {
     
     constructor( private readonly formDataParser: FormDataParser ){ }

     execute(request: Request): Promise<any> {

          return new Promise( async (resolve, reject) => {

               if(!request.is('multipart/form-data')) return reject(new FileError({ contentType:INVALID_CONTENT_TYPE}))
        
               const formidable = this.formDataParser.execute();

               formidable.parse(request, async (err: Error, fields:any) => {
                    if(err) return reject(err);

                    const { files, conflicts } = this.formDataParser.getResult();
                    console.log(files, conflicts)
                    
                    if(Object.keys(conflicts).length > 0 ) return reject(new FileError(conflicts))
                    return resolve(files)
               });
          }) 
    }
}


export default ExpressFormDataParserAdapter
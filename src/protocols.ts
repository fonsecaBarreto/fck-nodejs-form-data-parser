export namespace FormDataParser {

     export interface SchemaProperties {
          types_allowed: string[],
          max_size: number,
          optional: boolean,
          count?: number
     }
     export type Schema = Record<string, SchemaProperties>

     /* Result */
     export interface FileResult {
          buffer: any,
          contentType: string,
          size: number
          fileName:string
     }
     export type FileConflict = { message: string, fileName?: string  }

     export type Result = Record<string, FileResult[] >
     export type Conflicts = Record<string, FileConflict[] > 
     
}

export interface FormDataParser {
     execute(): any,
     getResult(): { files: FormDataParser.Result, conflicts: FormDataParser.Conflicts}
}


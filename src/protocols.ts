export namespace FormDataParser {

     export interface SchemaProperties {
          types_allowed: string[],
          max_size: number,
          optional: boolean,
          multiples?: boolean
     }
     export type Schema = Record<string, SchemaProperties>

     /* Result */
     export interface FileResult {
          buffer: any,
          contentType: string,
          size: number
          fileName:string
     }
     export type Result = Record<string, FileResult[] | FileResult>

     /* Error */
     export type Conflicts = Record<string, string> 
     
}

export interface FormDataParser {
     execute(): any,
     getResult(): { files: FormDataParser.Result, conflicts: FormDataParser.Conflicts}
}


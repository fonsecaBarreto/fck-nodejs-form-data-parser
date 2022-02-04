
import { Formidable, IncomingForm } from 'formidable'
import { MakeInvalidFileMessage, MakeMissingFileMessage } from './presentation/messages';
import { FormDataParser } from './protocols';

export class FormidableAdapter implements FormDataParser{

    private readonly incommingform: any;
    private results: any ={};
    private conflicts: FormDataParser.Conflicts = {};

    constructor(
        private readonly schema: FormDataParser.Schema
    ){

        this.incommingform = new IncomingForm({ multiples: schema.multiples ? true : false });
    }
    execute(){
        this.results = {}
        this.conflicts = {}
        const fieldNames = Object.keys(this.schema);
        var partCount: any = {}

        this.incommingform.onPart = (part:any) => {

            if (!part.filename || !part.mime ) { this.incommingform.handlePart(part); }     // it will not handle non-Files
            if ( part.mime && fieldNames.includes(part.name)) {                             // Only file with the name in the schema

            const { types_allowed, max_size, multiples } = this.schema[part.name]

            var fileName = part.name;
            var type = part.mime

            this.results[fileName] = this.results[fileName] ?? [];
            partCount[part.name]  = partCount[part.name] ? partCount[part.name] + 1 : 1

            console.log(type)
            if(!types_allowed.includes(type)) { 
                this.conflicts[fileName] =  MakeInvalidFileMessage( types_allowed, max_size )
            }

            var buffer_array: any =[]
            var totalSize = 0
            var form: FormDataParser.FileResult = { buffer: null, contentType: part.mime, size: 0, fileName: part.filename }
    
            part.on('data', (buffer: Buffer) => {
                buffer_array.push(buffer);
                totalSize += buffer.length;
                if(totalSize > max_size) this.conflicts[fileName] = MakeInvalidFileMessage( types_allowed, max_size ) ;
            });
            
            part.on('end', (data:any) =>{
                form.buffer = Buffer.concat(buffer_array);
                form.size = form.buffer.length;
                this.results[fileName] = multiples ? [ ...this.results[part.name], form ] : form  
            })
        }

       };

       return this.incommingform
    }

    getResult():{ files: FormDataParser.Result, conflicts: FormDataParser.Conflicts } {

        var files = { ...this.results}; 
        var conflicts = {...this.conflicts}; 

        Object.keys(this.schema).map( key => {
             const specs = this.schema[key]
             if( !Object.keys(files).includes(key) && specs.optional !== true  ){
                let conflictsAlreadyExists = Object.keys(conflicts).findIndex(v=>v==key)
                if(!conflictsAlreadyExists) conflicts[key] = MakeMissingFileMessage(key);
             }
        }) 

        return { files, conflicts };
   }
}

export default FormidableAdapter
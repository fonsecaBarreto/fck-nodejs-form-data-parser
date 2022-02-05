
import { Formidable, IncomingForm } from 'formidable'
import { MakeFileLengthExceed, MakeInvalidFileMessage, MakeMissingFileMessage } from './messages';
import { FormDataParser } from './protocols';

export class FormidableAdapter implements FormDataParser{

    private readonly incommingform: any;
    private results: FormDataParser.Result ={};
    private conflicts: FormDataParser.Conflicts = {};

    constructor(
        private readonly schema: FormDataParser.Schema
    ){
        this.incommingform = new IncomingForm({ multiples: true });
    }
    execute(){

        this.results = {}
        this.conflicts = {}

        this.incommingform.onPart = (part:any) => {

            if (!part.filename || !part.mime ) { this.incommingform.handlePart(part); }     // it will not handle non-Files
            if ( part.mime && Object.keys(this.schema).includes(part.name)) {                             // Only file with the name in the schema

            const { types_allowed, max_size, count = 1 } = this.schema[part.name]

            var fileName = part.filename;
            var name = part.name;
            var type = part.mime

            this.results[name] = this.results[name] ?? [];
            this.conflicts[name] = this.conflicts[name] ?? [];

            /* Checar Tipo */
            if(!types_allowed.includes(type)) { 
                var new_conflict: FormDataParser.FileConflict = { fileName, message: MakeInvalidFileMessage( types_allowed, max_size )}
                this.conflicts[name] = [  ...this.conflicts[name], new_conflict ];
            }

            /*  */
            var buffer_array: any =[]
            var totalSize = 0
            var form: FormDataParser.FileResult = { buffer: null, contentType: part.mime, size: 0, fileName: part.filename }
    
            part.on('data', (buffer: Buffer) => {
                buffer_array.push(buffer);
                totalSize += buffer.length;
                if(totalSize > max_size){ 
                    var new_conflict: FormDataParser.FileConflict = { fileName, message: MakeInvalidFileMessage( types_allowed, max_size ) }
                    this.conflicts[name] = [ ...this.conflicts[name], new_conflict ]
                }
            });
            
            part.on('end', (data:any) =>{

                form.buffer = Buffer.concat(buffer_array);
                form.size = form.buffer.length;
                this.results[name] = [ ...this.results[name], form ] 

                    
                /* Checar quantidade  */
                if(this.results[name].length > 0 && this.results[name].length > count){
                    var new_conflict: FormDataParser.FileConflict = {  message: MakeFileLengthExceed(count)}
                    this.conflicts[name] = [  new_conflict ];
                }

            })
        }

       };

       return this.incommingform
    }

    getResult():{ files: FormDataParser.Result, conflicts: FormDataParser.Conflicts } {

        var files: any = {}; 
        var conflicts: any = {}; 

        Object.keys(this.schema).map( key => {
            const { optional } = this.schema[key];
            if( (!this.results[key] || this.results?.[key].length == 0) && optional !== true){
                conflicts[key] =[ { message: MakeMissingFileMessage(key)}];
            }
        }) 

        Object.keys(this.results).map(f=>{
            if(this.results[f].length > 0){ files[f] = [ ...this.results[f] ] }
        })

        Object.keys(this.conflicts).map(c=>{
            if(this.conflicts[c].length > 0){ conflicts[c] = [ ...this.conflicts[c] ] }
        })

        return { files, conflicts };
   }
}

export default FormidableAdapter
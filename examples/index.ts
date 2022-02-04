import express, { Request, Response} from 'express'
import FormidableAdapter, { FormDataParser } from   "../src"
import ExpressAdapter from "../src/ExpressAdapter"

const app = express();
const schema: FormDataParser.Schema = {
        "image_test": {
            types_allowed: ["image/png"],
            max_size: 1e+7, // 10mb
            optional: false
        },
        "image_test2": {
            types_allowed: ["image/jpeg"],
            max_size: 1e+7, // 10mb
            optional: false
        }
}

const formDataParser = new FormidableAdapter(schema);
const middleware = new ExpressAdapter(formDataParser)

app.post("/", async (req: Request, res: Response) =>{

    try{
        const result = await middleware.execute(req)
        return res.json(result)
    }catch(err: any){
        if(err.name === 'InvalidFilesError'){
            const { message, name, params } = err
            return res.json({ message, name, params})
        }
        return res.json({ message: "Server Error"})
    }
} 
);

app.listen(3000, ()=>{ console.log('app iniciado')})
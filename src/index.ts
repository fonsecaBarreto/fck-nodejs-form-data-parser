export * from './protocols'
export * from './FormDataParser'
export * from './ExpressAdapter'
import ExpressAdapter from './ExpressAdapter'
import FormidableAdapter from './FormDataParser'
import { FormDataParser } from './protocols'

const ExpressFormDataExtractor = (schema: FormDataParser.Schema) =>{
    const parser = new FormidableAdapter(schema);
    const expressMiddleware = new ExpressAdapter(parser)
    return expressMiddleware
}

export default ExpressFormDataExtractor
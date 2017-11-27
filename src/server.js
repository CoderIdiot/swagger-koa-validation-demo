import "babel-polyfill";
import Koa from 'koa'
import ValidatorFactory from 'swagger-koa-validate'

/*
 * Read the API, and init the validate
 */
import * as fs from "fs-extra"
const YAML = require('yamljs')
const $RefParser = require('json-schema-ref-parser')
var parser = new $RefParser()

const specStr = fs.readFileSync(__dirname + '/../api/api.yaml', 'utf-8')
const spec = YAML.parse(specStr)
var validate = ValidatorFactory(spec)


const app = new Koa()

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        ctx.status = error.status || 400
        ctx.body = { message: error.message }
        console.log('Error', error.status, error.message)
    }
})
app.use(validate)
app.use(ctx => {
    ctx.body = 'hello world'
})

app.listen(3000)

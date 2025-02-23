import fs from "node:fs";
import path from "node:path";
import { generateApi, generateTemplates } from "swagger-typescript-api";

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
    name: "MySuperbApi.ts",
    // set to `false` to prevent the tool from writing to disk
    output: path.resolve(process.cwd(), "./src/__generated__"),
    url: "http://api.com/swagger.json",
    input: path.resolve(process.cwd(), "./foo/swagger.json"),
    spec: {
        swagger: "2.0",
        info: {
            version: "1.0.0",
            title: "Swagger Petstore",
        },
        // ...
    },
    templates: path.resolve(process.cwd(), "./api-templates"),
    httpClientType: "axios", // or "fetch"
    defaultResponseAsSuccess: false,
    generateClient: true,
    generateRouteTypes: false,
    generateResponses: true,
    toJS: false,
    extractRequestParams: false,
    extractRequestBody: false,
    extractEnums: false,
    unwrapResponseData: false,
    prettier: {
        // By default prettier config is load from your project
        printWidth: 120,
        tabWidth: 2,
        trailingComma: "all",
        parser: "typescript",
    },
    defaultResponseType: "void",
    singleHttpClient: true,
    cleanOutput: false,
    enumNamesAsValues: false,
    moduleNameFirstTag: false,
    generateUnionEnums: false,
    typePrefix: "",
    typeSuffix: "",
    enumKeyPrefix: "",
    enumKeySuffix: "",
    addReadonly: false,
    sortTypes: false,
    sortRouters: false,
    extractingOptions: {
        requestBodySuffix: ["Payload", "Body", "Input"],
        requestParamsSuffix: ["Params"],
        responseBodySuffix: ["Data", "Result", "Output"],
        responseErrorSuffix: [
            "Error",
            "Fail",
            "Fails",
            "ErrorData",
            "HttpError",
            "BadResponse",
        ],
    },
    /** allow to generate extra files based with this extra templates, see more below */
    extraTemplates: [],
    anotherArrayType: false,
    fixInvalidTypeNamePrefix: "Type",
    fixInvalidEnumKeyPrefix: "Value",
    codeGenConstructs: (constructs) => ({
        ...constructs,
        RecordType: (key, value) => `MyRecord<key, value>`,
    }),
    primitiveTypeConstructs: (constructs) => ({
        ...constructs,
        string: {
            "date-time": "Date",
        },
    }),
    hooks: {
        onCreateComponent: (component) => {},
        onCreateRequestParams: (rawType) => {},
        onCreateRoute: (routeData) => {},
        onCreateRouteName: (routeNameInfo, rawRouteInfo) => {},
        onFormatRouteName: (routeInfo, templateRouteName) => {},
        onFormatTypeName: (typeName, rawTypeName, schemaType) => {},
        onInit: (configuration) => {},
        onPreParseSchema: (originalSchema, typeName, schemaType) => {},
        onParseSchema: (originalSchema, parsedSchema) => {},
        onPrepareConfig: (currentConfiguration) => {},
    },
})
    .then(({ files, configuration }) => {
        files.forEach(({ content, name }) => {
            fs.writeFile(path, content);
        });
    })
    .catch((e) => console.error(e));

generateTemplates({
    cleanOutput: false,
    output: PATH_TO_OUTPUT_DIR,
    httpClientType: "fetch",
    modular: false,
    silent: false,
    rewrite: false,
});
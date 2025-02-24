import path from "node:path";
import { generateApi, generateTemplates } from "swagger-typescript-api";

/* NOTE: all fields are optional expect one of `input`, `url`, `spec` */
generateApi({
    name: "api.ts",
    output: path.resolve(process.cwd(), "./client/src/api/gen/"),
    input: path.resolve(process.cwd(), "./server/docs/swagger.json"),
    // templates: path.resolve(process.cwd(), "./api-templates"),
    httpClientType: "axios",
    defaultResponseAsSuccess: false,
    generateClient: true,
    generateRouteTypes: true,
    generateResponses: true,
    toJS: false,
    extractRequestParams: false,
    extractRequestBody: false,
    extractEnums: false,
    unwrapResponseData: false,
    prettier: {
        printWidth: 120,
        tabWidth: 2,
        trailingComma: "all",
        singleQuote: true,
        semi: true,
        parser: "typescript",
    },
    defaultResponseType: "void",
    singleHttpClient: true,
    cleanOutput: false,
    enumNamesAsValues: false,
    moduleNameFirstTag: false,
    modular: true,
    generateUnionEnums: false,
    typePrefix: "Api",
    typeSuffix: "",
    enumKeyPrefix: "Enum",
    enumKeySuffix: "",
    addReadonly: false,
    sortTypes: true,
    sortRoutes: true,
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
    fixInvalidTypeNamePrefix: "Type",
    fixInvalidEnumKeyPrefix: "Value",
})
    .catch((e) => console.error(e));

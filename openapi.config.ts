// @ts-ignore
const { generateService } = require('@umijs/openapi')

generateService({
  schemaPath: `${process.env.NEXT_PUBLIC_BACKEND_URL}/swagger/user.swagger.json`,
  serversPath: './src/app/backend',
  requestLibPath: "import request from 'umi-request'",
  apiPrefix: "process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'",
  projectName: "user",
})


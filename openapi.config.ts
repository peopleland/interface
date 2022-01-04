// @ts-ignore
const { generateService } = require('@umijs/openapi')

generateService({
  schemaPath: `https://peopleland-backend-dev.netlify.app/swagger/user.swagger.json`,
  serversPath: './src/app/backend',
  requestLibPath: "import request from '../../../lib/request'",
  apiPrefix: "process.env.NEXT_PUBLIC_BACKEND_URL + '/.netlify/functions'",
  projectName: "user",
})


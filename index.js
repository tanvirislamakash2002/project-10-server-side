import config from './config/index.js'
import app from './src/app.js'
const port = config.port

app.listen(port, () => {
  console.log(`ph server is on the go ${port}`)
})

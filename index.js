import app from './src/app.js'
const port = process.env.PORT || 3000



app.listen(port, () => {
  console.log(`ph server is on the go ${port}`)
})

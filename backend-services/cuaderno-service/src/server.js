import app from './app.js'

const port = process.env.PORT || 8002

app.listen(port, () => {
  console.log(`Cuaderno service listening on port ${port}`)
})
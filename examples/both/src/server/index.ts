import express from 'express'

import { render } from './render';

const app = express();

app.get("*", (request, response) => {
  return response.send(render())
})

app.listen(3000)

// if(module.hot) {
//   module.hot.accept()
// }
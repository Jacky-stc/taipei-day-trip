import * as view from "./view.js"
import * as model from "./model.js"

model.fetchUrl("/api/member", "GET", view.getOrderList)

view.mainResize()
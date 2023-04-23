import { setBasePort, setHighestPort, getPortPromise } from "portfinder";
import { BASE_PUB_PORT, HIGH_PUB_PORT } from "./environment.js";

setBasePort(BASE_PUB_PORT);
setHighestPort(HIGH_PUB_PORT);

export const Port = async function Port() {
    return getPortPromise()
}
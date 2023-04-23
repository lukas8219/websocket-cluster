import { PUB_PORT, isLocal } from "./environment.js";
import { Port } from "./port-randomizer.js";

export async function getPubPort(){
    const PORT = isLocal ? await Port() : PUB_PORT;
    return PORT;
}
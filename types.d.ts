import { Connection } from "mongoose"

declare global{
    var mongoose:{
        conn: Connection | null,
        promise:Promise | null
    }
}

export {}
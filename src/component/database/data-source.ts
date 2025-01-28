import { DataSource } from "typeorm";
import { Account } from "./account-entity.js";


export const Data_Source = new DataSource({
    type: "sqlite",
    database: "Ai_Extracta_accounts.db",
    entities: [Account],
    synchronize: true
})


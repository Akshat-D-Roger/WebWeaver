import { boltAction } from "./boltAction";

export interface boltArtifact{
    id:string|null,
    title:string|null,
    actions:boltAction[]
}
import { randomUUID } from "crypto";

export const categories =(adminUserId:string | undefined)=>[
    { 
        id: randomUUID(), 
        category_name: "Engine Parts", 
        category_desc: "Description for Category A", 
        unit: "Piece" ,
        createdBy: adminUserId,
        updatedBy : adminUserId
    },
    { 
        id: randomUUID(), 
        category_name: "Engine Oil", 
        category_desc: "Description for Category A", 
        unit: "Litre" ,
        createdBy: adminUserId,
        updatedBy : adminUserId
    }
];

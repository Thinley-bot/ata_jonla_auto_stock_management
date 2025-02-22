import { randomUUID } from "crypto";

export const brands =(adminUserId:string | undefined)=>[
        { 
            id: randomUUID(), 
            brand_name: "Toyota", 
            brand_desc: "This the toyoto.",
            createdBy: adminUserId,
            updatedBy : adminUserId
        },
        { 
            id: randomUUID(), 
            brand_name: "Honda", 
            brand_desc: "This the honda." ,
            createdBy: adminUserId,
            updatedBy : adminUserId
        },
    ];

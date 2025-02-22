import { randomUUID } from "crypto";


export const parts =(adminUserId : string | undefined, categoryId :string | undefined, brandId:string | undefined) =>[
    {
        id: randomUUID(),
        part_name: "Engine Oil Filter",
        part_number: "EO12345",
        category_id: categoryId,
        brand_id: brandId,
        createdBy: adminUserId,
        updatedBy : adminUserId
    },
    {
        id: randomUUID(),
        part_name: "Brake Pad Set",
        part_number: "BP67890",
        category_id: categoryId,
        brand_id: brandId,
        createdBy: adminUserId,
        updatedBy : adminUserId
    },
];
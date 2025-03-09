import { db } from "~/server/db";
import { NewPartCatalogue, part_catalogue} from "../../db/schema/part_catalogue";
import { eq } from "drizzle-orm";

export const getPartCatalogues = async() => {
    return await db.query.part_catalogue.findMany({
        with :{ 
            part_category: true, 
            car_brand: true,      
            createdBy: true,
            updatedBy: true,  
        }
    })
}

export const getPartCatalogue = async(partId:string) => await db.query.part_catalogue.findFirst({
    with: {
        part_category: true,
        car_brand: true,
        createdBy: true,
        updatedBy: true,
    },
    where: eq(part_catalogue.id, partId)
});

export const createPartCatalogue = async(userId:string, newPartCatalogue : NewPartCatalogue) => 
    await db.insert(part_catalogue).values({...newPartCatalogue, createdBy:userId})

export const updatePartCatalogue = async(partId:string, partCatalogue : Partial<NewPartCatalogue>, userId : string) => 
    await db.update(part_catalogue).set({updatedBy : userId , ...partCatalogue}).where(eq(part_catalogue.id,partId))

export const deletePartCatalogue = async(partId:string) => 
    await db.delete(part_catalogue).where(eq(part_catalogue.id,partId))

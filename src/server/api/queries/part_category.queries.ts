import { db } from "~/server/db";
import {NewPartCategory, part_category } from "../../db/schema/part_category";
import { eq } from "drizzle-orm";

export const getPartCategoriesImpl = async() => 
    await db.select().from(part_category);

export const getPartCategoryImpl =  async(categoryId:string) => 
    await db.select().from(part_category).where(eq(part_category.id,categoryId));

export const createPartCategoryImpl = async(userId:string,newCategory: NewPartCategory) => 
    await db.insert(part_category).values({createdBy:userId,...newCategory});

export const updatePartCategoryImpl = async(categoryId:string, userId:string, updateCategory: Partial<NewPartCategory>) => 
    await db.update(part_category).set({updatedBy:userId,...updateCategory}).where(eq(part_category.id,categoryId));

export const deletePartCategoryImpl = async(categoryId:string) => 
    await db.delete(part_category).where(eq(part_category.id,categoryId));
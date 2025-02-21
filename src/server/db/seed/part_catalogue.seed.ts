import { drizzle } from "drizzle-orm/node-postgres";
import { part_catalogue, part_category, car_brand } from "../schema/index";
import { randomUUID } from "crypto";

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    connectionString:"postgresql://postgres:T_JfnKDJ1Rw6nsLN@192.168.92.127:5432/auto_parts_stock_management",
});

const db = drizzle(pool);

export async function partCatalogueSeed() {
    console.log("-----------------------seedding part catalogue data ---------------------------")
    const categories = [
        { id: randomUUID(), category_name: "Engine Parts", category_desc: "Description for Category A", unit: "Unit A" },
        { id: randomUUID(), category_name: "Brake System", category_desc: "Description for Category A", unit: "Unit A" }
    ]
    const categories_res = await db.insert(part_category).values(categories).returning();
    console.log("-----------------Categories seeded successfully------------------------------");

    const brands = [
        { id: randomUUID(), brand_name: "Toyota", brand_desc: "This the toyoto." },
        { id: randomUUID(), brand_name: "Honda", brand_desc: "This the honda." },
    ];
    const brand_res = await db.insert(car_brand).values(brands).returning();
    console.log("------------------------------Brands seeded successfully---------------------");

    const parts = [
        {
            id: randomUUID(),
            part_name: "Engine Oil Filter",
            part_number: "EO12345",
            category_id: categories_res[0]?.id,
            brand_id: brand_res[0]?.id,
        },
        {
            id: randomUUID(),
            part_name: "Brake Pad Set",
            part_number: "BP67890",
            category_id: categories_res[1]?.id,
            brand_id: brand_res[1]?.id,
        },
    ];
    await db.insert(part_catalogue).values(parts);
    console.log("------------------------Parts seeded successfully-----------------------");
    process.exit(0)
}

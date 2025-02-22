import { drizzle } from "drizzle-orm/node-postgres";
import { 
    part_catalogue, 
    part_category, 
    car_brand, 
    user_role, 
    users, 
    stock_sale_detail, 
    stock_sale, 
    supplier, 
    stock 
} from "../schema/index";
import { randomUUID } from "crypto";
import pg from "pg";
import { roles } from "./seed_data/user_role.seed";
import { brands } from "./seed_data/brand.seed";
import { categories } from "./seed_data/categories.seed";
import { parts } from "./seed_data/parts.seed";
import { stockSales } from "./seed_data/stock_sale.seed";
import { suppliers as seedSuppliers } from "./seed_data/supplier.seed";
import { stocks } from "./seed_data/stock.seed";
import { stockSaleDetails } from "./seed_data/stock_sale_detail";

const { Pool } = pg;

// Database connection
const pool = new Pool({
    connectionString: "postgresql://postgres:T_JfnKDJ1Rw6nsLN@192.168.162.127:5432/auto_parts_stock_management"
});
const db = drizzle(pool);

export async function Seed() {
    console.log("-----------------------Seeding part catalogue data---------------------------");

    try {
        // Step 1: Seed roles
        const rolesRes = await db.select().from(user_role);
        console.log("------------------------User Roles seeded successfully---------------------");
        const adminRoleId = rolesRes.find((role) => role.role_name === "Admin")?.id;
        if (!adminRoleId) {
            throw new Error("Admin role not found after seeding roles.");
        }

        // Step 2: Seed users
        const usersData = await db.select().from(users);
        const adminUserId = usersData[0]?.id
        console.log("------------------------Users seeded successfully---------------------");

        // Step 3: Seed car brands
        const carBrandData = brands(adminUserId);
        const carBrandRes = await db.insert(car_brand).values(carBrandData).returning();
        const carBrandId = carBrandRes[0]?.id // Get all brand IDs
        console.log("------------------------Car brands seeded successfully---------------------");

        // Step 4: Seed part categories
        const partsCategoryData = categories(adminUserId);
        const partsCategoryRes = await db.insert(part_category).values(partsCategoryData).returning();
        const partsCategoryId = partsCategoryRes[0]?.id // Get all category IDs
        console.log("------------------------Part categories seeded successfully---------------------");

        // Step 5: Seed part catalogue
        const partsCatalogueData = parts(adminUserId, partsCategoryId, carBrandId);
        const partsCatalogueRes = await db.insert(part_catalogue).values(partsCatalogueData).returning();
        const partIds = partsCatalogueRes.map((part) => part.id); // Get all part IDs
        console.log("------------------------Part catalogue seeded successfully---------------------");

        // Step 6: Seed suppliers
        const supplierData = seedSuppliers(adminUserId);
        const supplierRes = await db.insert(supplier).values(supplierData).returning();
        const supplierIds = supplierRes.map((supp) => supp.id); // Get all supplier IDs
        console.log("------------------------Suppliers seeded successfully---------------------");

        // Step 7: Seed stock
        const stockData = stocks(adminUserId, partIds, supplierIds);
        const stockRes = await db.insert(stock).values(stockData).returning();
        console.log("------------------------Stock seeded successfully---------------------");

        // Step 8: Seed sales
        const saleData = stockSales(adminUserId);
        const sales = await db.insert(stock_sale).values(saleData).returning();
        const saleIds = sales.map((sale) => sale.id); // Get all sale IDs
        console.log("------------------------Sales seeded successfully---------------------");

        // Step 9: Seed sale details
        const detailsData = stockSaleDetails(adminUserId, saleIds, partIds);
        await db.insert(stock_sale_detail).values(detailsData);
        console.log("------------------------Sale details seeded successfully---------------------");

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        process.exit(0);
    }
}

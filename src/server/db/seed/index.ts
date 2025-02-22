import { Seed } from "./seed";

try {
    Seed();
} catch (err) {
    console.log(err);
    process.exit;
}
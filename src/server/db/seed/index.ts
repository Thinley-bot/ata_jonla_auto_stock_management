import { partCatalogueSeed } from "./part_catalogue.seed";

try {
    partCatalogueSeed();
} catch (err) {
    console.log(err);
    process.exit;
}
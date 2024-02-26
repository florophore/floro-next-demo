import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const staticDir = path.join(__dirname, '../../public')
const localesDir = path.join(staticDir, 'locales');

export default class StaticLocaleStorageAccessor {

    public static async writeLocales(
        fileName: string,
        localesJson: string
    ): Promise<boolean> {
        try {
            // If using a CDN upload here
            const filePath = path.join(localesDir, fileName);
            await fs.writeFile(filePath, Buffer.from(localesJson), {});
            return true;
        } catch(e) {
            return false;
        }

    }
}
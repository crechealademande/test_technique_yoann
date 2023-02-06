import fs from "fs/promises";
import assert from "assert";
import Child, { ChildData } from "./child";
import parseCsv from "../tools/parsecsv";

const CSV_HEADER: { [index: string]: string } = {
    "Nom":                  "name",
    "Prénom":               "surname",
    "date de naissance":    "birthdate",
    "adresse":              "address",
    "code postal":          "pcode",
    "ville":                "city",
    "crèche actuelle":      "crecheDetails"
};

/**
 * Classe représentant une liste d'enfants
 */
class ChildrenPool {
    
    pool: Child[] = [];

    /**
     * Importer un fichier CSV pour alimenter la liste d'enfants
     * @param csvFile Chemin complet du fichier CSV à importer
     */
    async readFromCsv(csvFile: string) {

        // Lecture du fichier brut
        const csvChildren = await fs.readFile(csvFile, "utf-8");

        // Conversion du format CSV en tableau, en tenant compte des éléments qui pourraient être entre guillemets
        const tabChildren = parseCsv(csvChildren.replace(/\r\n/g, "\n"), {
            newline: "\n",
            delimiter: ",",
            quote: "\""
        });

        // Récupération de l'entête du tableau, décrivant la nature des colonnes
        const header = tabChildren.shift()?.map(col => (CSV_HEADER)[col] );

        const checkSameLength = (header?.length || 0) == Object.keys(CSV_HEADER).length;
        const checkNoUndefined = !header?.some(hdr => hdr === undefined);
        assert(checkSameLength && checkNoUndefined, `La récupération de l'entête du tableau CSV a échoué, les colonnes attendues sont ${Object.keys(CSV_HEADER).join(", ")}`);

        for(const entry of tabChildren) {
            try {
                // Interprétation d'une ligne du tableau
                const childData = header?.reduce((childData, col, index) => {
                    childData[col] = entry[index];
                    return childData;
                }, {} as { [index: string]: string });
                
                // Création d'une instance d'enfant et ajout à la liste
                this.pool.push(new Child(childData as unknown as ChildData));    
            } catch (error) {
                console.error("[ChildrenPool] Impossible d'importer une ligne du fichier csv :", error);
            }
        }
    }
}

export default ChildrenPool;
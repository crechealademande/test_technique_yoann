import fs from "fs/promises";
import assert from "assert";
import Creche, { CrecheData } from "./creche";
import parseCsv from "../tools/parsecsv";

const CSV_HEADER: { [index: string]: string } = {
    "Nom":          "name",
    "capacité":     "capacity",
    "adresse":      "address",
    "code postal":  "pcode",
    "ville":        "city",
};

/**
 * Classe représentant une liste de crèches
 */
class CrechePool {

    pool: Creche[] = [];

    /**
     * Importer un fichier CSV pour alimenter la liste de crèches
     * @param csvFile Chemin complet du fichier CSV à importer
     */
    async readFromCsv(csvFile: string) {

        // Lecture du fichier brut
        const csvCreche = await fs.readFile(csvFile, "utf-8");

        // Conversion du format CSV en tableau, en tenant compte des éléments qui pourraient être entre guillemets
        const tabCreche = parseCsv(csvCreche.replace(/\r\n/g, "\n"), {
            newline: "\n",
            delimiter: ",",
            quote: "\r"
        });

        // Récupération de l'entête du tableau, décrivant la nature des colonnes
        const header = tabCreche.shift()?.map( col => CSV_HEADER[col] );
        
        const checkSameLength = (header?.length || 0) == Object.keys(CSV_HEADER).length;
        const checkNoUndefined = !header?.some(hdr => hdr === undefined);
        assert(checkSameLength && checkNoUndefined, `La récupération de l'entête du tableau CSV a échoué, les colonnes attendues sont ${Object.keys(CSV_HEADER).join(", ")}`);

        for(const entry of tabCreche) {
            try {
                // Interprétation d'une ligne du tableau
                const crecheData = header?.reduce((crecheData, col, index) => {
                    crecheData[col] = entry[index];
                    return crecheData;
                }, {} as { [index: string]: string });

                // Création d'une instance de crèche et ajout à la liste
                this.pool.push(new Creche(crecheData as unknown as CrecheData));    
            } catch (error) {
                console.error("[CrechePool] Impossible d'importer une ligne du fichier csv :", error);
            }
        }
    }

    /**
     * Rechercher dans la liste des crèches des textes qui pourraient tous se trouver dans une crèche (dans les différentes propriétés)
     * @param criteria tableau de textes à rechercher dans toutes les propriétés des crèches
     * @returns Un tableau de crèches possédant tous les textes précisés
     */
    find(criteria: string[]) {
        // Filtre dans toute la liste des crèches
        return this.pool.filter( creche => {
            // On parcours tous les critères fournis
            return criteria.map(crit => crit.trim().toLowerCase()).reduce( (prev, crit) => {
                // Chaque critère doit au moins se trouver dans une propriété
                const found = creche.name.toLowerCase().includes(crit) ||
                    creche.capacity.toString() == crit ||
                    creche.address.toLowerCase().includes(crit) ||
                    creche.pcode.toString() == crit ||
                    creche.city.toLowerCase().includes(crit);
                return prev && found;
            }, criteria.length > 0);
        });
    }
}

export default CrechePool;
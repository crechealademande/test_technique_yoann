/** 
 * Test technique CALD 2023
 * 
 * Yoann VERMAUT
 */

import assert from "assert";
import path from "path";
import Child from "./classes/child";
import ChildrenPool from "./classes/childrenPool";
import Creche from "./classes/creche";
import CrechePool from "./classes/crechepool";
import MatchMaker, { ChildMatchResult } from "./classes/matchmaker";

async function main() {
    try {
    
        // Création du pool de crèche
        const creches = new CrechePool();

        // Alimentation du pool par le fichier csv creches.csv
        await creches.readFromCsv(path.join(process.cwd(), "inputs", "creches.csv"));    

        assert(creches.pool.length > 0, "Aucune crèche importée, vérifiez l'import du fichier creche.csv");

        // Création du pool d'enfant
        const children = new ChildrenPool();

        // Alimentation du pool par le fichier csv famille.csv
        await children.readFromCsv(path.join(process.cwd(), "inputs", "familles.csv"));

        assert(children.pool.length > 0, "Aucun enfant importé, vérifiez l'import du fichier familles.csv");

        // Définition des critères d'admissions
        const admissionAssertion = [
            (child: Child) => {
                const prev4Months = new Date();
                prev4Months.setMonth(prev4Months.getMonth() - 4);
                if(child.birthdate.getTime() > prev4Months.getTime()) {
                    return "L'enfant doit être agé de plus de 4 mois pour être admis en crèche";
                }
            },
            (child: Child) => {
                const prev4Years = new Date();
                prev4Years.setFullYear(prev4Years.getFullYear() - 4);
                if(child.birthdate.getTime() < prev4Years.getTime()) {
                    return "L'enfant doit être agé de moins de 4 ans pour être admis en crèche";
                }
            },
            (child: Child) => {
                if(child.crecheDetails.length > 0) {
                    const assignedCreche = creches.find(child.crecheDetails);
                    if(assignedCreche.length > 0) {
                        return `L'enfant est déjà pris en charge par la crèche '${assignedCreche[0].uuid} / ${assignedCreche[0].name}'`;
                    }
                    else {
                        return `Attention, l'enfant est indiqué comme déjà pris en charge, mais la crèche est introuvable avec les informations précisées (${child.crecheDetails.join(", ")}). Veuillez vérifier les informations et relancer le traitement.`;
                    }
                }
            },
        ];

        // Définition des critère de sélection des crèches
        const selectionCriteria = [{
            // La crèche doit se trouver dans le même département que l'enfant
            check: (child: Child, creche: Creche) => child.pcode.slice(0,2) == creche.pcode.slice(0,2),
            mandatory: true,
        },
        {
            // La crèche se trouve dans la même ville que l'enfant
            check: (child: Child, creche: Creche) => child.pcode == creche.pcode,
            mandatory: false,
        }];

        // Création de l'instance de recherche des meilleurs crèches
        const matchMaking = new MatchMaker({
            creches,
            children,
            admissionAssertion,
            selectionCriteria,
        });

        // Exécute la recherche des meilleurs crèches
        const results = matchMaking.execute();

        // Affiche les résultats dans la console
        printResults(creches, results);

    } catch (error) {
        console.error("Erreur du programme principal : ", error);
    }    
}

/**
 * Affiche les résultats de la recherche des meilleures crèches
 * @param creches Pool de crèches utilisées
 * @param results Résulats à afficher
 */
function printResults(creches: CrechePool, results: ChildMatchResult[]) {

    console.log("Avec les crèches suivantes :");
    for(const creche of creches.pool) {
        console.log(`${creche.uuid} ${creche.name} ${creche.pcode} ${creche.city}`);
    }
    console.log("---------------------------------------------------------------------------------------------");

    for(const result of results) {
        console.log("---------------------------------------------------------------------------------------------");
        console.log(`${result.child.name} ${result.child.surname}, né le ${result.child.birthdate.toLocaleDateString()}`);
        console.log(`Vivant à ${result.child.pcode} ${result.child.city}`);
        if(result.allowed) {
            console.log("EST ADMISSIBLE");
            if(result.creches?.length) {
                console.log("Dans les crèches suivantes:");
                for(const crecheRes of result.creches) {
                    console.log("  - ", crecheRes.creche.name, crecheRes.creche.pcode, crecheRes.creche.city,  "uuid =", crecheRes.creche.uuid);
                }
            }
            else {
                console.log("Malheureusement, aucune crèche ne correspond aux critères de sélection");
            }
        }
        else {
            console.log(`N'EST PAS ADMISSIBLE pour (au moins) la raison suivante : ${result.reason}`);
        }
    }
}

main();
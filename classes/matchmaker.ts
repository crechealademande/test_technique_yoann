import Child from "./child";
import ChildrenPool from "./childrenPool";
import Creche from "./creche";
import CrechePool from "./crechepool";

// Fonction d'admission
type admissionAssertion = (child: Child) => string | undefined

// Critère de sélection
type selectionCriteria = {
    check: (child: Child, creche: Creche) => boolean,
    mandatory: boolean,
}

// Paramètres du matchmaker
type MatchMakerParams = {
    creches: CrechePool,
    children: ChildrenPool,
    admissionAssertion: admissionAssertion[],
    selectionCriteria: selectionCriteria[]
}

// Crèche avec un score de sélection
type CrecheResult = {
    creche: Creche,
    score: number
}

// Résultat d'admission et de sélection d'un enfant
export type ChildMatchResult = {
    child: Child,
    allowed: boolean,
    reason?: string,
    creches?: CrecheResult[],
}

/**
 * Classe de l'algorithme d'admission d'enfants et de sélection de crèche
 */
class MatchMaker {

    creches: CrechePool;
    children: ChildrenPool;
    admissionAssertion: admissionAssertion[];
    selectionCriteria: selectionCriteria[];

    constructor(params: MatchMakerParams) {
        this.creches = params.creches;
        this.children = params.children;
        this.admissionAssertion = params.admissionAssertion;
        this.selectionCriteria = params.selectionCriteria;
    }

    /**
     * Exécute l'admission et la recherche des crèches pour chaque enfants
     * @returns {ChildMatchResult[]} La liste des résultats d'admission et de sélection
     */
    execute() {
        const result = [];

        for(const child of this.children.pool) {
            
            const childResult: ChildMatchResult = {
                child,
                allowed: true,
            };

            // 1. Exécution des règles d'admission, si la fonction retourne un message, l'admission est refusée et le message en est la cause.
            for(const admAssert of this.admissionAssertion) {
                const message = admAssert(child);
                if(typeof message == "string") {
                    childResult.allowed = false;
                    childResult.reason = message;
                    break;
                }
            }
            
            if(childResult.allowed) {

                // On commence avec le pool entier des crèches
                let selectedCreches = this.creches.pool;

                // 2. Exécution des critères obligatoires de sélection pour éliminer les crèches non valides
                for(const selCrit of this.selectionCriteria.filter( crit => crit.mandatory)) {
                    selectedCreches = selectedCreches.filter( creche => selCrit.check(child, creche) );
                }
                childResult.creches = selectedCreches.map(creche => ({ creche, score: 0}));


                // 3. Exécution des critères optionnels sur les crèches valide. Attribution d'un score selon le nombre de critères validés
                for(const crecheRes of childResult.creches) {
                    crecheRes.score = this.selectionCriteria.filter( crit => !crit.mandatory).reduce( (score, selCrit) => score + (selCrit.check(child, crecheRes.creche) ? 1 : 0), 0 );
                }

                // Tri des crèches valides selon un score décroissant
                childResult.creches = childResult.creches.sort((a,b) => b.score - a.score);
            }

            // Ajout du résultat de cet enfant au résultat général
            result.push(childResult);
        }

        return result;
    }
}

export default MatchMaker;
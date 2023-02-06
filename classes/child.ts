import assert from "assert";

export type ChildData = {
    name: string,
    surname: string,
    birthdate: string,
    address: string,
    pcode: string,
    city: string,
    crecheDetails?: string
}

/**
 * Classe représentant un enfant
 */
class Child {
    name: string;
    surname: string;
    birthdate: Date;
    address: string;
    pcode: string;
    city: string;
    crecheDetails: string[];

    constructor(data: ChildData) {
        assert(data.name, "Le nom de l'enfant est manquant");
        assert(data.surname, "Le prénom de l'enfant est manquant");
        assert(data.birthdate, "La date de naissance de l'enfant est manquante");
        assert(data.address, "L'adresse de l'enfant est manquante");
        assert(data.pcode, "Le code postal de l'enfant est manquant");
        assert(data.city, "La ville de l'enfant est manquant");
        
        this.name = data.name,
        this.surname = data.surname,
        this.birthdate = parseDate(data.birthdate),
        this.address = data.address,
        this.pcode = data.pcode,
        this.city = data.city,
        this.crecheDetails = data.crecheDetails?.split(",").map(det => det.trim()) || [];
    }
}

/**
 * transforme une date au format texte "JJ/MM/AAAA" en date
 * @param text Date au format texte "JJ/MM/AAAA"
 */
function parseDate(text: string) {
    const tab = text.split("/");
    assert(tab.length >= 3, `la date à interpréter '${text}' ne semble pas au format 'JJ/MM/AAAA'`);
    
    const year = parseInt(tab[2]);
    const month = parseInt(tab[1]);
    const day = parseInt(tab[0]);
    assert(!isNaN(day + month + year), `la date à interpréter '${text}' est invalide`);
    
    const dateResult = new Date(year, month-1, day);
    assert(!isNaN(day + month + year), `la date à interpréter '${text}' est invalide`);

    return dateResult;
}

export default Child;
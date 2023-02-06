import crypto from "crypto";
import assert from "assert";

export type CrecheData = {
    name: string,
    capacity: string,
    address: string,
    pcode: string,
    city: string,
}

/**
 * Classe représentant une crèche
 */
class Creche {

    uuid: string;
    name: string;
    capacity: string;
    address: string;
    pcode: string;
    city: string;

    constructor(data: CrecheData) {
        assert(data.name, "Le nom de la crèche est manquant");
        assert(data.capacity, "La capacité de la crèche est manquante");
        assert(data.address, "L'adresse de la crèche est manquante");
        assert(data.pcode, "Le code postal de la crèche est manquant");
        assert(data.city, "La ville de la crèche est manquante");

        this.uuid = crypto.randomUUID();
        this.name = data.name;
        this.capacity = data.capacity;
        this.address = data.address;
        this.pcode = data.pcode;
        this.city = data.city;
    }
}

export default Creche;
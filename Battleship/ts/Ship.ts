class Ship {
    image: string;
    length: number;
    damageTaken: number;
    inventory: number;
    name: string;
    isDestroyed: boolean;
	id : string;

    constructor(name: string, image: string, inventory: number, length: number, id: string) {
        this.name = name;
        this.image = image;
        this.inventory = inventory;
        this.length = length;
		this.id = id;
        this.damageTaken = 0;
    }

    Hit(): boolean {
        this.damageTaken += 1;
        this.isDestroyed = this.damageTaken === length;
        if (this.isDestroyed) { this.Destroy(); }
        return this.isDestroyed;
    }

    Destroy() {
        this.inventory -= 1;        
    }
}

var Ship = (function () {
    function Ship(name, image, inventory, length, id) {
        this.name = name;
        this.image = image;
        this.inventory = inventory;
        this.length = length;
        this.id = id;
        this.damageTaken = 0;
    }
    Ship.prototype.Hit = function () {
        this.damageTaken += 1;
        this.isDestroyed = this.damageTaken === length;
        return this.isDestroyed;
    };
    return Ship;
})();
//# sourceMappingURL=Ship.js.map

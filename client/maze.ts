function getRandomColor(): EColor {
    return Math.floor(Math.random() * Object.values(EColor).length);
}

interface Coords {
    x: number;
    y: number;
}

export enum EColor {
    white,
    red,
    yellow,
    blue,
    green,
    purple,
    orange, 
    pink,
    black,
}

export class Point implements Coords {
    id : number;
    x: number;
    y: number;
    color: EColor;
    examinated: boolean;
    neighbors: Point[];
    value: number;

    constructor(x: number, y: number, color: EColor) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.examinated = false;
        this.neighbors = [this];
        this.value = 1;
    }

    setId(id: number): void {
        this.id = id;
    }

    getAdjacentCoords(): Coords[] {
        return [{
            x: this.x + 1,
            y: this.y,
        }, {
            x: this.x - 1,
            y: this.y,
        }, {
            x: this.x,
            y: this.y + 1,
        }, {
            x: this.x,
            y: this.y - 1,
        }];
    }

    isColorSynced(another: Point): boolean {
        return this.color === another.color;
    }

    compareAndUpdate(another: Point): Point {
        if (!another || !this.isColorSynced(another))
            return;

        if (this.isNeighbor(another)) //Already examinated as same list
            return;

        let filteredNeighbors = another.neighbors.filter(point => !this.isNeighbor(point));
        this.neighbors.push(...filteredNeighbors);
        this.value = this.neighbors.length;
        
        for (let neighbor of this.neighbors) {
            neighbor.neighbors = this.neighbors;
            neighbor.value = this.value;
        }
    }

    isNeighbor(another: Point): boolean {
        return !!this.neighbors.find(item => item.id == another.id);
    }
}

export class Maze {
    height: number;
    width: number;
    colors: EColor[];
    points: Point[];
    colorMap: any; // not used;

    constructor(width: number, height: number, numberOfColors: number) {
        let self = this;
        self.width = width;
        self.height = height;
        self.colors = [];
        self.points = [];
        self.colorMap = {};
        for (let i = 0; i < numberOfColors; i++) {
            let color = getRandomColor();
            self.colors.push(color);
            self.colorMap[color] = 0;
        }

        self.generate();
    }

    generate(): void {
        let self = this;
        for (let i = 0; i < this.height; i++)
            for(let j = 0; j < this.width; j++) {
                let point = new Point(j, i, Math.floor(Math.random() * this.colors.length));
                point.setId(this.getPointIndexByCoords(j, i));
                self.points.push(point);
            }

    }

    solve(start?: Point): void {
        // this.examinate(start || this.getPointByIndex(30)); // Random start
        let self = this;
        self.points.forEach(point => self.examinate(point)); // iterating version
    }

    examinate(point: Point): void {
        if (!point)
            return;

        if (point.examinated)
            return;

        point.examinated = true;
        let adjacents = this.getAdjacentPoints(point);

        if (!adjacents)
            return;

        for (let adj of adjacents)
            point.compareAndUpdate(adj);

        // for (let adj of adjacents)
            // this.examinate(adj); // Recursive version, could throw stack overflow error if maze is large.
                                    // Can consider to switch to normal iteration
    }

    getPointIndexByCoords(x: number, y: number): number {
        return this.height * y + x;
    }

    getPointByIndex(index: number): Point {
        return this.points[index];
    }

    getPointByCoords(coords: Coords): Point {
        if (coords.x < 0 || coords.y < 0 || coords.x > this.width - 1 || coords.y > this.height - 1) // Out of maze
            return;

        return this.getPointByIndex(this.getPointIndexByCoords(coords.x, coords.y));
    }

    getAdjacentPoints(center: Point): Point[] {
        let self = this;
        return center.getAdjacentCoords().map(coords => self.getPointByCoords(coords));
    }
}

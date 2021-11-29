// generate board
const maze = document.querySelector('.maze');
const ctx = maze.getContext('2d');


let currentCell;
let goal;

class Maze {
    constructor(size, rows, columns) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    setup () {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r,c,this.grid,this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        currentCell = this.grid[0][0];
        this.grid[this.rows-1][this.columns-1].goal = true;
    }

    draw () {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = 'black';
        currentCell.visited = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c= 0; c < this.columns; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }

        let next = currentCell.checkNeighborCells();
        
        if (next) {
            next.visited = true;
            this.stack.push(currentCell);

            currentCell.highlightCurrentCell(this.columns);

            currentCell.removeWall(currentCell, next);

            currentCell = next;
        }
        else if (this.stack.length > 0){
            let cell = this.stack.pop();
            currentCell = cell;
            currentCell.highlightCurrentCell(this.columns);
        }

        if (this.stack.length == 0) {
            return;
        }

        window.requestAnimationFrame(() => this.draw());
    }
}

class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true
        };
        this.goal = false;
    }

    checkNeighborCells() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighborCells = [];

        let topNeighbor = row !== 0 ? grid[row-1][col] : undefined;
        let bottomNeighbor = row !== grid.length - 1 ? grid[row+1][col] : undefined;
        let rightNeighbor = col !== grid.length - 1 ? grid[row][col+1] : undefined;
        let leftNeighbor = col !== 0 ? grid[row][col-1] : undefined;
        
        if (topNeighbor && !topNeighbor.visited) neighborCells.push(topNeighbor);
        if (bottomNeighbor && !bottomNeighbor.visited) neighborCells.push(bottomNeighbor);
        if (rightNeighbor && !rightNeighbor.visited) neighborCells.push(rightNeighbor);
        if (leftNeighbor && !leftNeighbor.visited) neighborCells.push(leftNeighbor);

        if (neighborCells.length !== 0) {
            let randomNextCell = Math.floor(Math.random()*neighborCells.length);
            return neighborCells[randomNextCell];
        }
        else {
            return undefined;
        }
    }


    drawTopWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+size/columns, y);
        ctx.stroke();
    }

    drawRightWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x+size/columns, y);
        ctx.lineTo(x+size/columns, y+size/rows);
        ctx.stroke();
    }

    drawBottomWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y+size/rows);
        ctx.lineTo(x+size/columns, y+size/rows);
        ctx.stroke();
    }

    drawLeftWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+size/rows);
        ctx.stroke();
    }

    highlightCurrentCell(columns) {
        let x = this.colNum * this.parentSize / columns + 1;
        let y = this.rowNum * this.parentSize / columns + 1;

        ctx.fillStyle = 'purple';
        ctx.fillRect(x, y, this.parentSize/columns-3, this.parentSize/columns-3)

    }

    removeWall(cellOne, cellTwo) {
        let x = cellOne.colNum - cellTwo.colNum;
        if (x == 1) {
            cellOne.walls.leftWall = false;
            cellTwo.walls.rightWall = false;
        }
        else if (x == -1) {
            cellOne.walls.rightWall = false;
            cellTwo.walls.leftWall = false;
        }

        let y = cellOne.rowNum - cellTwo.rowNum;

        if (y == 1) {
            cellOne.walls.topWall = false;
            cellTwo.walls.bottomWall = false;
        }
        else if (y == -1){
            cellOne.walls.bottomWall = false;
            cellTwo.walls.topWall = false;
        }
    }

    show(size, rows, columns) {
        let x = this.colNum * size / columns;
        let y = this.rowNum * size / rows;

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
        if (this.visited) {
            ctx.fillRect(x+1, y+1, size/columns - 2, size/rows - 2);
        }
        
        if (this.goal) {
            ctx.fillStyle = "rgb(83, 247, 43)";
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    }
}

const generateButtons = document.querySelectorAll('.generate-button');
for (let i = 0; i<generateButtons.length; i++) {
    generateButtons[i].addEventListener('click', startGeneration);
}

function startGeneration(event) {
    let button = event.target; 
    let buttonSize = button.id;

    if (buttonSize == 'Small') {
        console.log("i have entered")
        let newMaze = new Maze(500,10,10);
        newMaze.setup();
        newMaze.draw();
    }
    else if (buttonSize == 'Medium') {
        let newMaze = new Maze(500,15,15);
        newMaze.setup();
        newMaze.draw();
    }
    else {
        let newMaze = new Maze(500,25,25);
        newMaze.setup();
        newMaze.draw();
    }
}






 
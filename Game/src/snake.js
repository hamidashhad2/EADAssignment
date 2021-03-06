    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');
    var grid = 32;
    var count = 0;
    var score = 0;
    var scoreTag = document.getElementById("score");


    scoreTag.innerText = score;
    var animatoinRef;
    var snake = {
        x: 160,
        y: 160,

        // snake velocity. moves one grid length every frame in either the x or y direction
        dx: grid,
        dy: 0,

        // keep track of all grids the snake body occupies
        cells: [],

        // length of the snake. grows when eating an apple
        maxCells: 4
    };
    var apple = {
        x: 320,
        y: 320
    };
    // get random whole numbers in a specific range
    // @see https://stackoverflow.com/a/1527820/2124254
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // game loop
    function loop() {
        animatoinRef = requestAnimationFrame(loop);

        //slow game loop to 15 fps instead of 60 (60/15 = 4)
        if (++count < 4) {
            return;
        }
        count = 0;
        context.clearRect(0,0,canvas.width,canvas.height);
        // move snake by it's velocity
        snake.x += snake.dx;
        snake.y += snake.dy;
        // wrap snake position horizontally on edge of screen
        if (snake.x < 0) {
            snake.x = canvas.width - grid;
        }
        else if (snake.x >= canvas.width) {
            snake.x = 0;
        }

        // wrap snake position vertically on edge of screen
        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        }
        else if (snake.y >= canvas.height) {
            snake.y = 0;
        }
        // keep track of where snake has been. front of the array is always the head
        snake.cells.unshift({x: snake.x, y: snake.y});
        // remove cells as we move away from them
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
        // draw apple
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid-1, grid-1);
        // draw snake one cell at a time
        context.fillStyle = 'green';
        snake.cells.forEach(function(cell, index) {

            // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
             if(index==0)
             {
                 context.fillStyle = 'blue';
                 context.fillRect(cell.x, cell.y, grid-1, grid-1);  
                 context.fillStyle = 'green';
             }
            else
            {
                context.fillRect(cell.x, cell.y, grid-1, grid-1);

            }
            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                // canvas is 400x400 which is 25x25 grids
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 20) * grid;
                score +=10;
                scoreTag.innerText = score;
            }

            // snake occupies same space as a body part. reset game
          if (cell.x === snake.x && cell.y === snake.y && index !=0 ) {
            snake.x = 160;
            snake.y = 160;
            snake.cells = [];
            snake.maxCells = 4;
            snake.dx = grid;
            snake.dy = 0;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
            cancelAnimationFrame(animatoinRef);
            context.font = "60px Georgia";
            var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop("0"," magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            context.fillStyle = gradient;
            context.fillText("Game Over",270, 320,);
            alert("Game Over");
            var high = window.localStorage.getItem("score");
            var preScore = 0;
            if(high !== null){
                preScore = parseInt(high);
            }
            if(score > preScore){
            var info = prompt("High Score..!!!!\nEnter your Name: ");
                window.localStorage.setItem("score", score);
                window.localStorage.setItem("name", info);
            }

        }
            
        });
    }
    // listen to keyboard events to move the snake
    document.addEventListener('keydown', function(e) {
        // prevent snake from backtracking on itself by checking that it's
        // not already moving on the same axis (pressing left while moving
        // left won't do anything, and pressing right while moving left
        // shouldn't let you collide with your own body)

        // left arrow key
        if (e.which === 37 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
        // up arrow key
        else if (e.which === 38 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        }
        // right arrow key
        else if (e.which === 39 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        }
        // down arrow key
        else if (e.which === 40 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        }
    });
    // start the game
    animatoinRef = requestAnimationFrame(loop);


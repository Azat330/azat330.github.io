const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
let cubSequence = [];
let playfield = [];


for (let row = -2; row < 20; row++) {
  playfield[row] = [];
  

for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
    
  }

}

// cubs

const cubs = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

//cubs colors

const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};


let count = 0;
let cub = getNextCub();
let rAF = null;  
let gameOver = false;
let level = 0;



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    cubSequence.push(name);
  }
}

function getNextCub() {
    if (cubSequence.length === 0) {
      generateSequence();
    }
    const name = cubSequence.pop();
    const matrix = cubs[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === 'I' ? -1 : -2;
    return {
      name: name,      
      matrix: matrix,  
      row: row,        
      col: col         
    };
  }


function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );
  return result;
}


function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }
  return true;
}

function placeCub() {
  for (let row = 0; row < cub.matrix.length; row++) {
    for (let col = 0; col < cub.matrix[row].length; col++) {
      if (cub.matrix[row][col]) {


        if (cub.row + row < 0) {
          return showGameOver();
        }
        playfield[cub.row + row][cub.col + col] = cub.name;
      }
    } 
  }

  
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {
  
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
      }
    }
    else {
      row--;
    }
  }
  cub = getNextCub();
}


// knopkeq
let myGame = document.getElementById("game"); 

function PlayPause()
{
   
    playpause = !playpause;
    if(playpause)
    {
        document.getElementById("playpause").value = "Play";
        alert("Game has been paused!");
    }
    else
    {
        document.getElementById("playpause").value = "Pause";
        alert("Game is now playing!");
    }
}



  //  Game Over
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  
  }



function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        context.fillRect(col * grid, row * grid, grid-1, grid-1);
      }
    }
  }

  

 
  if (cub) {
    if (++count > (36 - level)) {
      cub.row++;
      count = 0;
    if (!isValidMove(cub.matrix, cub.row, cub.col)) {
      cub.row--;
        placeCub();
      }
    }
    context.fillStyle = colors[cub.name];

    
    for (let row = 0; row < cub.matrix.length; row++) {
      for (let col = 0; col < cub.matrix[row].length; col++) {
        if (cub.matrix[row][col]) {

          
          context.fillRect((cub.col + col) * grid, (cub.row + row) * grid, grid-1, grid-1);
        }
      }
    }
  }
}


document.addEventListener('keydown', function(e) {
 
  if (gameOver) return;

  if (e.which === 37 || e.which === 39) {
    const col = e.which === 37
      ? cub.col - 1
      : cub.col + 1;

    
    if (isValidMove(cub.matrix, cub.row, col)) {
      cub.col = col;
    }
  }

  
  if (e.which === 38) {
    const matrix = rotate(cub.matrix);
    if (isValidMove(matrix, cub.row, cub.col)) {
      cub.matrix = matrix;
    }
  }


  if(e.which === 40) {
    const row = cub.row + 1;
    if (!isValidMove(cub.matrix, row, cub.col)) {
      cub.row = row - 1;
      placeCub();
      return;
    }
   
    cub.row = row;
  }
});

// start
rAF = requestAnimationFrame(loop);
  

  


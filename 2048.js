var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
     const howTo = document.getElementById("how-to-play-box");
    howTo.style.display = "block";

    // Close via cross
    document.getElementById("close-how-to-cross").onclick = function() {
        howTo.style.display = "none";
    }
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    /*board = [
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [4, 4, 8, 8],
        [4, 4, 8, 8]
    ]*/

    for(let r=0;r<rows;r++) {
        for(let c=0;c<columns;c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile,num);
            document.getElementById("board").append(tile);

        }
    }

    setTwo();
    setTwo();

}

function hasEmptyTile() {
    for(let r=0;r<rows;r++) {
        for(let c=0;c<columns;c++) {
            if(board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {

    if(!hasEmptyTile()) {
        return;
    }
    let found = false;
    while(!found) {
        //randome r,c
        let r = Math.floor(Math.random()*rows);//0-1*4->0-3
        let c = Math.floor(Math.random()*columns);

        if(board[r][c]==0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if(num > 0) {
        tile.innerText = num;
        if(num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if(e.code == "ArrowLeft") {
       slideLeft();
       setTwo();
    }
    else if(e.code == "ArrowRight") {
       slideRight();
       setTwo();
    }
    else if(e.code == "ArrowUp") {
       slideUp();
       setTwo();
    }
    else if(e.code == "ArrowDown") {
       slideDown();
       setTwo();
    }
    document.getElementById("score").innerText = score;

    if(isGameOver()) {
    document.getElementById("game_over").style.display="block";
    document.getElementById("res_button").style.display = "block";

}});

function filterZero(row) {
    return row.filter(num => num!=0);//create a new array without zeroes

}

function slide(row) {
    //[0,2,2,2]
    row = filterZero(row);//get rid of zeroes [2,2,2]

    //slide
    for(let i=0;i<row.length-1;i++) {
        //check every 2
        if(row[i]==row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }//[2,2,2]->[4,0,2]
    }

    row = filterZero(row);//[4,2]

    //add zeroes
    while(row.length < columns) {
        row.push(0);
    }//[4,2,0,0]

    return row;
}

function slideLeft() {
    for(let r=0;r<rows;r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for(let c=0;c<columns;c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for(let r=0;r<rows;r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        for(let c=0;c<columns;c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for(let c=0;c<columns;c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for(let r=0;r<rows;r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

        }
    }
}

function slideDown() {
    for(let c=0;c<columns;c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for(let r=0;r<rows;r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

        }
    }
}

function isGameOver() {
    for(let r = 0;r < rows;r++) {
        for(let c = 0;c < columns;c++) {
            if(board[r][c]==0) {
                return false;
            }
            if(c<columns-1 && board[r][c]==board[r][c+1]) {
                return false;
            }
            if(r<rows-1 && board[r][c]==board[r+1][c]) {
                return false;
            }
        }
    }
    return true;
}

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// detect when touch starts
document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

// detect when touch ends
document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    handleSwipe();
}, false);

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if(Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if(dx > 30) { // right swipe
            slideRight();
            setTwo();
        } else if(dx < -30) { // left swipe
            slideLeft();
            setTwo();
        }
    } else {
        // Vertical swipe
        if(dy > 30) { // swipe down
            slideDown();
            setTwo();
        } else if(dy < -30) { // swipe up
            slideUp();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;

    if(isGameOver()) {
        document.getElementById("game_over").style.display="block";
        document.getElementById("restart-btn").style.display = "block";
    }
}

const boardElement = document.getElementById("board");

boardElement.addEventListener("touchstart", function(e) {
    e.preventDefault(); // prevent page scroll
}, { passive: false });

boardElement.addEventListener("touchmove", function(e) {
    e.preventDefault(); // prevent page scroll while swiping
}, { passive: false });



function restartGame() {
    // Reset score
    score = 0;
    document.getElementById("score").innerText = score;

    // Clear the board
    document.getElementById("board").innerHTML = "";

    // Hide Game Over message and restart button
    document.getElementById("game_over").style.display = "none";
    document.getElementById("res_button").style.display = "none";

    // Re-initialize the board
    setGame();
}



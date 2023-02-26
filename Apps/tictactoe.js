const settings = {
    message: "Hello from myModule!",
    settingsArray: JSON.parse(localStorage.getItem("settingsTopBar")),
    loadApp(){
        fetch('../HtmlTemplates/tictactoe.html')
        .then(response => response.text())
        .then(html => {
            const htmlParent = document.getElementById("app-overlay-id");
            htmlParent.insertAdjacentHTML('beforeend', html);

            let board = [];
            let currentPlayer = "X";
            let gameStatus = "Game On";
            let saveScores = document.getElementById('saveScores');
            let resetBoard = document.getElementById('resetBoard');
            let seeScore = document.getElementById('scores_display');

            const renderBoard = function()
            {
                let boardElement = document.querySelector(".board");

                boardElement.innerHTML = "";
                for (let i = 0; i < board.length; i++) {
                    let cell = document.createElement("div");
                    cell.classList.add("cell");
                    cell.innerHTML = board[i] || "&nbsp;";
                    cell.addEventListener("click", () => handleCellClick(i));
                    boardElement.appendChild(cell);
                }
            }

            const handleCellClick = function(index) {
                if (gameStatus !== "Game On") {
                    return;
                }
                if (board[index]) {
                    return;
                }

                if(localStorage.getItem("vibrationPermission") === "true"){
                    navigator.vibrate(100);
                    console.log("vibrate");
                }

                board[index] = currentPlayer;
                renderBoard();
                checkGameStatus();

                currentPlayer = currentPlayer === "X" ? "O" : "X";
            }

            const checkGameStatus = function() {
                let winningConditions = [
                  [0, 1, 2],
                  [3, 4, 5],
                  [6, 7, 8],
                  [0, 3, 6],
                  [1, 4, 7],
                  [2, 5, 8],
                  [0, 4, 8],
                  [2, 4, 6],
                ];
                for (let condition of winningConditions) {
                  let [a, b, c] = condition;
                  if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    gameStatus = `${currentPlayer} wins!`;

                    alert("Joueur "+currentPlayer+" a gagné");

                    let tmp = parseInt(document.getElementById('score'+currentPlayer).value);

                    document.getElementById('score'+currentPlayer).value = tmp+1;

                    return;
                  }
                }
                if (!board.includes("")) {
                  gameStatus = "Tie!";
                  alert("Egalité !");
                }
            }

            saveScores.addEventListener("click", function(){

                let scoreX = document.getElementById('scoreX').value;
                let scoreO = document.getElementById('scoreO').value;

                let json_score = {'X': scoreX, 'O': scoreO};

                localStorage.setItem("scoreTicTacToe", JSON.stringify(json_score));

                if(localStorage.getItem("vibrationPermission") === "true"){
                    navigator.vibrate(100);
                    console.log("vibrate");
                }

                console.log(localStorage);
            });

            resetBoard.addEventListener("click", function(){

                if(localStorage.getItem("vibrationPermission") === "true"){
                    navigator.vibrate(100);
                    console.log("vibrate");
                }

                gameStatus = "Game On";
                board = Array(9).fill("");
                renderBoard();
            });

            seeScore.addEventListener("change", function(){

                if(localStorage.getItem("vibrationPermission") === "true"){
                    navigator.vibrate(100);
                    console.log("vibrate");
                }

                if(this.checked){
                    document.getElementById('scores').style.display = 'block';
                } else {
                    document.getElementById('scores').style.display = 'none';
                }
            });

            let score = JSON.parse(localStorage.scoreTicTacToe);

            if (score['X'] !== undefined) {
                document.getElementById('scoreX').value = score['X'];
            }

            if (score['O'] !== undefined) {
                document.getElementById('scoreO').value = score['O'];
            }

            board = Array(9).fill("");
            renderBoard();
        })
        .catch(error => alert("Erreur dans le chargement de l'application."));
    },
};

export default settings;
//Мы постарали объяснить каждую строку JavaScript с помощью комментариев....Надеюсь, вы поймете

//выбор всех необходимых элементов
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{ //после загрузки окна
    for (let i = 0; i < allBox.length; i++) { //добавляем атрибут onclick для всех доступных span
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide"); //скрываем select box
    playBoard.classList.add("show"); //показываем секцию playboard
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide"); //скрываем select box
    playBoard.classList.add("show"); //показываем секцию playboard
    players.setAttribute("class", "players active player"); //устанавливаем атрибут class для players со значениями players active player
}

let playerXIcon = "fas fa-times"; //имя класса иконки крестика из FontAwesome
let playerOIcon = "far fa-circle"; //имя класса иконки круга из FontAwesome
let playerSign = "X"; //глобальная переменная, так как мы используем ее в нескольких функциях
let runBot = true; //глобальная переменная с булевым значением, мы используем ее, чтобы остановить бота, когда кто-то выиграет или будет ничья

// функция клика пользователя
function clickedBox(element){
    if(players.classList.contains("player")){
        playerSign = "O"; //если игрок выбрал O, меняем playerSign на O
        element.innerHTML = `<i class="${playerOIcon}"></i>`; //добавляем тег иконки круга в кликнутый пользователем элемент/ячейку
        players.classList.remove("active"); //удаляем активный класс у players
        element.setAttribute("id", playerSign); //устанавливаем атрибут id в span/ячейке с выбранным знаком игрока
    }else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`; //добавляем тег иконки крестика в кликнутый пользователем элемент/ячейку
        element.setAttribute("id", playerSign); //устанавливаем атрибут id в span/ячейке с выбранным знаком игрока
        players.classList.add("active"); //добавляем активный класс к players
    }
    selectWinner(); //вызываем функцию selectWinner
    element.style.pointerEvents = "none"; //после выбора ячейки пользователем, она больше не может быть кликнута
    playBoard.style.pointerEvents = "none"; //устанавливаем pointerEvents в none для игрового поля, чтобы пользователь не мог сразу кликнуть на другую ячейку, пока бот не сделает ход
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //генерируем случайное время задержки, чтобы бот выбирал ячейку с задержкой
    setTimeout(()=>{
        bot(runBot); //вызываем функцию бота
    }, randomTimeDelay); //передаем случайное значение задержки
}

// функция автоматического выбора бота
function bot(){
    let array = []; //создаем пустой массив...будем хранить индексы невыбранных ячеек
    if(runBot){ //если runBot true
        playerSign = "O"; //меняем playerSign на O, если игрок выбрал X, значит бот будет O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ //если ячейка/элемент span не содержит дочерних элементов, т.е. тега <i>
                array.push(i); //вставляем индекс невыбранных ячеек в массив
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; //получаем случайный индекс из массива, чтобы бот выбрал случайную невыбранную ячейку
        if(array.length > 0){ //если длина массива больше 0
            if(players.classList.contains("player")){ 
                playerSign = "X"; //если игрок выбрал O, значит бот будет X
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`; //добавляем тег иконки крестика в выбранный ботом элемент
                allBox[randomBox].setAttribute("id", playerSign); //устанавливаем атрибут id в span/ячейке с выбранным знаком игрока
                players.classList.add("active"); //добавляем активный класс к players
            }else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`; //добавляем тег иконки круга в выбранный ботом элемент
                players.classList.remove("active"); //удаляем активный класс у players
                allBox[randomBox].setAttribute("id", playerSign); //устанавливаем атрибут id в span/ячейке с выбранным знаком игрока
            }
            selectWinner(); //вызываем функцию selectWinner
        }
        allBox[randomBox].style.pointerEvents = "none"; //после выбора ячейки ботом пользователь не может кликнуть на эту ячейку
        playBoard.style.pointerEvents = "auto"; //устанавливаем pointerEvents в auto для игрового поля, чтобы пользователь снова мог кликнуть на ячейку
        playerSign = "X"; //если игрок выбрал X, то бот будет O, затем мы снова меняем playerSign на X, чтобы пользователь был X, так как выше мы изменили playerSign на O для бота
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; //возвращаем значение id
}
function checkIdSign(val1, val2, val3, sign){ //проверяем, равны ли все значения id знаку (X или O), если да, то возвращаем true
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ //если совпадает одна из следующих выигрышных комбинаций, выбираем победителя
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
        runBot = false; //устанавливаем runBot в false, чтобы бот больше не выполнялся
        bot(runBot); //вызываем функцию бота
        setTimeout(()=>{ //после выигрыша одного из игроков скрываем игровое поле и показываем блок с результатом через 700 мс
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); //1с = 1000мс
        wonText.innerHTML = `Игрок <p>${playerSign}</p> выиграл игру!`; //отображаем текст победы с использованием playerSign (X или O)
    }else{ //если все ячейки/элементы имеют значение id и никто не выиграл, то игра заканчивается вничью
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
            runBot = false; //устанавливаем runBot в false, чтобы бот больше не выполнялся
            bot(runBot); //вызываем функцию бота
            setTimeout(()=>{ //после ничьей скрываем игровое поле и показываем блок с результатом через 700 мс
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700); //1с = 1000мс
            wonText.textContent = "Матч закончился вничью!"; //отображаем текст ничьей
        }
    }
}

replayBtn.onclick = ()=>{
    window.location.reload(); //перезагружаем текущую страницу при клике на кнопку повтора
}

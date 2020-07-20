var options = document.getElementsByClassName("option");

for(option of options) {
    if (getCookie(`color_puzzle_${option.innerHTML}_done`) == "done") {
        option.className += " finished"
    }
    option.onclick = function() {
        location.href = "board.html?puzzle=" + this.innerHTML;
    }
}
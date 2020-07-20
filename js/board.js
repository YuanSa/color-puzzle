var board = document.getElementById("body");
var hint = document.getElementById("hint");
var flag_game_start = false;
var tile_focuse = false;
var rank, colors, colors_x = [], size, tiles_fixed, tiles_orde, r, g, b;

// 获取谜题号码
const params = new URLSearchParams(window.location.search);
var puzzle = params.get("puzzle");
get_puzzle(puzzle);

// 获取谜题信息
function get_puzzle() {
    
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState==4 && request.status==200) {
            game_start(JSON.parse(request.responseText));
        }
    }
    request.open("GET", `puzzles/${puzzle}.json`, true);
    request.send();
}

// 游戏开始
function game_start(game_info) {
    // 初始化变量
    rank = game_info.rank;
    colors = game_info.colors;
    
    // color_x = { [ [r1,r2,r3...], [g1,g2,g3...], [b1,b2,b3...] ], [ [r] [g] [b]] }
    colors_x.push([interpolation(colors[0][0],colors[1][0], rank), interpolation(colors[0][1],colors[1][1], rank), interpolation(colors[0][2],colors[1][2], rank)]);
    colors_x.push([interpolation(colors[2][0],colors[3][0], rank), interpolation(colors[2][1],colors[3][1], rank), interpolation(colors[2][2],colors[3][2], rank)]);
    size = `${Math.floor(10000/rank)/100}%`;
    console.log(colors);
    console.log(colors_x);

    // 生成序列
    tiles_order = sequence(0, rank ** 2 - 1);
    shuffle(tiles_order);
    tiles_fixed = get_tiles_fixed();
    rerank(tiles_order, tiles_fixed);

    // 按序列生成元素
    tiles_initial(rank, tiles_order);

    // 注册事件
    hint.onclick = hint_view;
    hint.value = true;

    // 标记
    flag_game_start = true;
}

// 生成固定的瓷砖
function get_tiles_fixed() {
    let res = [];
    if(rank <= 4) {
        res = [0, rank-1, rank*(rank-1), rank**2-1];
    } else if(rank <= 8) {
        res = res.concat(sequence(0, rank*(rank-1), rank));
        res = res.concat(sequence(rank-1, rank**2-1, rank));
    } else {
        res = res.concat(sequence(1, rank**2-2, 2));
    }
    return res;
}

// 结束界面 显示/隐藏
function hint_view() {
    if(this.value == true) {
        hint.style.opacity = 0;
        board.style.filter = "";
    } else {
        hint.style.opacity = 1;
        board.style.filter = "blur(.5em)";
    }
    this.value = !this.value;
}

// 按序列加入瓷砖
function tiles_initial() {
    let tile;
    for(index of tiles_order) {
        tile = document.createElement("div");
        tile.className = "tile";
        tile.id = `tile_${index}`;
        tile.value = index;
        tile.style.backgroundColor = get_color(index);
        if(tiles_fixed.indexOf(index) === -1)
            tile.onclick = tile_click;
        else
            tile.innerHTML = "X";
        tile.style.width = size;
        tile.style.height = size;
        board.appendChild(tile);
    }
}

// 获取瓷砖颜色
function get_color(index) {
    let color = [], x = index % rank, y = Math.floor(index / rank);
    // color_x: [up/down][r/g/b][position]
    color[0] = interpolation(colors_x[0][0][x],colors_x[1][0][x],rank)[y];
    color[1] = interpolation(colors_x[0][1][x],colors_x[1][1][x],rank)[y];
    color[2] = interpolation(colors_x[0][2][x],colors_x[1][2][x],rank)[y];
    //console.log(`x=${x}, y=${y}`);
    //console.log(`${colors_x[0][1][x]}, ${colors_x[1][1][x]}`);
    //console.log(color);
    return `rgb(${color[0]},${color[1]},${color[2]})`;
}

// 瓷砖点击事件
function tile_click() {
    if(flag_game_start) {
        if(tile_focuse === false) {
            this.className = "tile selected";
            tile_focuse = this.id;
        } else if(tile_focuse === this.id) {
            this.className = "tile";
            tile_focuse = false;
        } else {
            tile_change(tile_focuse, this.id)
            tile_focuse = false;
            if(check() === true) {
                flag_game_start = false;
                setTimeout(game_over, 500);
            }
        }
    }
}

// 瓷砖交换事件
function tile_change(id1, id2) {
    change_a = document.getElementById(id1);
    change_b = document.getElementById(id2);
    index_a = change_a.value;
    index_b = change_b.value;

    temp_index = tiles_order[index_a];
    tiles_order[index_a] = tiles_order[index_b];
    tiles_order[index_b] = temp_index;

    temp_color = change_a.style.backgroundColor;
    change_a.style.backgroundColor = change_b.style.backgroundColor;
    change_b.style.backgroundColor = temp_color;

    change_a.className = "tile";
    change_b.className = "tile";
    index_a = undefined;
    index_b = undefined;
    change_a = undefined;
    change_b = undefined;
    focuse = false;
}

// 检查是否解出谜题
function check() {
    for(index in tiles_order)
        if(tiles_order[index] != index)
            return false;
    return true;
}

// 游戏结束
function game_over() {
    setCookie(`color_puzzle_${puzzle}_done`, "done");
    board.style.filter = "blur(.5em)";
    hint.style.display = "flex";
    setTimeout(function() {hint.style.opacity = 1}, 1000);
}
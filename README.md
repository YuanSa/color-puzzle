# Color Puzzle

色彩解谜游戏。你可以在这里试玩：[元卅馆](www.yuansasi.com/lab/colorpuzzle)

你的目标是将色块还原成渐变图案。

带x的色块为固定色块。点击两块无x色块可以交换颜色。

## 添加谜题

在 puzzle 目录下添加新的谜题。

谜题以 JSON 格式存储，需要两个属性：

1. rank: <int> 谜题的阶数（每条边几个方块）
2. colors: <array<array>> 四个角的颜色（左上、右上、左下、右下；RGB格式，范围0~255）

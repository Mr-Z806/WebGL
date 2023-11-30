// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "uniform mat4 u_ModelMatrix;\n" +
  "void main() {\n" +
  "  gl_Position = u_ModelMatrix * a_Position;\n" + // 设置坐标
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n" + // 设置颜色
  "}\n";

var ANGLE_STEP = 45.0;
var Tx_STEP = 0.1;

function main() {
  var canvas = document.getElementById("webgl");

  // 获取webgl绘图上下文
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Fail to initialize shaders.");
    return;
  }

  // 设置顶点位置
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the positions of the vertices");
    return;
  }

  // 设置背景色
  gl.clearColor(0.5, 0.2, 0.1, 1.0);

  // 将旋转矩阵传输给顶点着色器
  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage lacation of u_xformMatrix");
    return;
  }

  var currentObject = {};
  // 当前旋转角度
  var currentAngle = 0.0;
  // 当前x轴移动
  var currentTx = 0.0;
  // 模型矩阵
  var modelMatrix = new Matrix4();

  // 开始绘制三角形
  var tick = function () {
    currentObject = animate(currentAngle, currentTx);
    currentAngle = currentObject.currentAngle;
    currentTx = currentObject.currentTx;
    draw(gl, n, currentAngle, currentTx, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick);
  };
  tick();
}

function draw(gl, n, currentAngle, currentTx, modelMatrix, u_ModelMatrix) {
  //设置旋转矩阵
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(currentTx, 0, 0);

  // 将数组传给u_xformMatrix变量
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制点
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

// 记录上一次调用函数的时刻
var g_last = Date.now();

function animate(angle, Tx) {
  //  计算距离上次调用经过多长的时间
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // 根据距离上次调用的时间更新当前旋转角度
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  var newTx = (Tx + Tx_STEP * elapsed / 1000.0);
  return {
    currentAngle: (newAngle %= 360),
    currentTx: newTx > 1.0 ? 0.0 : newTx,
  };
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([0, 0.3, -0.3, -0.3, 0.3, -0.3]);
  // 点的个数
  var n = 3;

  // 创建缓冲区对象
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 获取a_Position变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_position");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  return n;
}

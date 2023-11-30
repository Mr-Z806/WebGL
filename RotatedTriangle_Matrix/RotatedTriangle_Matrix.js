// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "uniform mat4 u_xformMatrix;\n" +
  "void main() {\n" +
  "  gl_Position = u_xformMatrix * a_Position;\n" + // 设置坐标
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n" + // 设置颜色
  "}\n";

var Sx = 1.5, Sy = 1.5, Sz = 0.0;
// var Tx = 0.5, Ty = 0.5, Tz = 0.0;
// var ANGLE = -45.0;

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

  // 创建旋转矩阵
  // var radian = (Math.PI * ANGLE) / 180.0; // 转为弧度制
  // var cosB = Math.cos(radian);
  // var sinB = Math.sin(radian);

  // 注意WebGL中矩阵是列主序的
  var xformMatrix = new Float32Array([
    Sx,  0.0, 0.0, 0.0,
    0.0, Sy,  0.0, 0.0,
    0.0, 0.0, Sz,  0.0,
    0.0, 0.0, 0.0, 1.0,
  ]);
  // var xformMatrix = new Float32Array([
  //   1.0, 0.0, 0.0, 0.0,
  //   0.0, 1.0, 0.0, 0.0,
  //   0.0, 0.0, 1.0, 0.0,
  //   Tx, Ty, Tz, 1.0,
  // ]);
  // var xformMatrix = new Float32Array([
  //   cosB,  sinB, 0.0, 0.0,
  //   -sinB, cosB, 0.0, 0.0,
  //   0.0,   0.0,  1.0, 0.0,
  //   0.0,   0.0,  0.0, 1.0,
  // ]);

  // 将旋转矩阵传输给顶点着色器
  var u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
  if (!u_xformMatrix) {
    console.log("Failed to get the storage lacation of u_xformMatrix");
    return;
  }
  // 将数组传给u_xformMatrix变量
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

  // 设置背景色
  gl.clearColor(0.5, 0.2, 0.1, 1.0);

  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制点
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
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

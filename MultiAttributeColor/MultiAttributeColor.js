// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" + // 设置坐标
  "  gl_PointSize = 10.0;\n" + // 设置点的大小
  "  v_Color = a_Color;\n" + // 将数据传给片元着色器
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_FragColor = v_Color;\n" + // 设置颜色
  "}\n";

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

  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制点
  gl.drawArrays(gl.TRIANGLES, 0, n);
  // gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    0, 0.3, 1.0, 0.0, 0.0, -0.3, -0.3, 0.0, 1.0, 0.0, 0.3, -0.3, 0.0, 0.0, 1.0,
  ]);
  // 点的个数
  var n = 3;

  // 创建缓冲区对象
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // 获取a_Position变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_position");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  // 获取a_PointSize变量的存储位置
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Color);

  return n;
}

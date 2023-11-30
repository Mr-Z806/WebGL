// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" + // 设置坐标
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "uniform float u_Width;\n" +
  "uniform float u_Height;\n" +
  "void main() {\n" +
  "  gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n" + // 设置颜色
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
  var verticesColors = new Float32Array([0, 0.3, -0.3, -0.3, 0.3, -0.3]);
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

  // 获取a_Position变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_position");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  var u_Width = gl.getUniformLocation(gl.program, "u_Width");
  if (!u_Width) {
    console.log("Failed to get the storage location of u_Width");
    return;
  }

  var u_Height = gl.getUniformLocation(gl.program, "u_Height");
  if (!u_Height) {
    console.log("Failed to get the storage location of u_Height");
    return;
  }

  // Pass the width and hight of the <canvas>
  gl.uniform1f(u_Width, gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  return n;
}

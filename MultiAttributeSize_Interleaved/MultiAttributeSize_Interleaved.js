// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute float a_PointSize;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" + // 设置坐标
  "  gl_PointSize = a_PointSize;\n" + // 设置点的大小
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n" + // 设置颜色
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
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  var verticesSizes = new Float32Array([
    0, 0.3, 10.0, -0.3, -0.3, 20.0, 0.3, -0.3, 30.0,
  ]);
  // 点的个数
  var n = 3;

  // 创建缓冲区对象
  var vertexSizeBuffer = gl.createBuffer();
  if (!vertexSizeBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

  // 获取a_Position变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_position");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);


  // 获取a_PointSize变量的存储位置
  var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage location of a_PointSize");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_PointSize);

  return n;
}

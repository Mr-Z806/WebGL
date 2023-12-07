// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "uniform mat4 u_MvpMatrix;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = u_MvpMatrix * a_Position;\n" + // 设置坐标
  "  v_Color = a_Color;\n" + // 设置坐标
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_FragColor = v_Color;\n" +
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
  gl.enable(gl.DEPTH_TEST);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  if (!u_MvpMatrix) {
    console.log("Failed to get the storage location of u_MvpMatrix");
    return;
  }

  var mvpMatrix = new Matrix4();

  // 透视投影
  mvpMatrix.setPerspective(30, canvas.width / canvas.clientHeight, 1, 100);
  mvpMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.POLYGON_OFFSET_FILL);

  gl.drawArrays(gl.TRIANGLES, 0, n / 2);

  gl.polygonOffset(1.0, 1.0);

  gl.drawArrays(gl.TRIANGLES, n / 2, n / 2);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
    0.0,  2.5,  -5.0,  0.4,  1.0,  0.4, // The green triangle
    -2.5, -2.5,  -5.0,  0.4,  1.0,  0.4,
    2.5, -2.5,  -5.0,  1.0,  0.4,  0.4, 

    0.0,  3.0,  -5.0,  1.0,  0.4,  0.4, // The yellow triagle
    -3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
    3.0, -3.0,  -5.0,  1.0,  1.0,  0.4, 
  ]);
  // 点的个数
  var n = 6;

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
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Position);

  // 将纹理坐标分配给a_TexCoord并开启它
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
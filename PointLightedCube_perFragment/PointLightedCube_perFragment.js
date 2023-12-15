// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "attribute vec4 a_Normal;\n" + // 法向量
  "uniform mat4 u_MvpMatrix;\n" +
  "uniform mat4 u_ModelMatrix;\n" + // 模型矩阵
  "uniform mat4 u_NormalMatrix;\n" + // 用来变换法向量的矩阵
  "varying vec4 v_Color;\n" +
  "varying vec3 v_Normal;\n" +
  "varying vec3 v_Position;\n" +
  "void main() {\n" +
  "  gl_Position = u_MvpMatrix * a_Position;\n" + // 设置坐标
  // 计算顶点的世界坐标
  "  v_Position = vec3(u_ModelMatrix * a_Position);\n" +
  "  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "uniform vec3 u_LightColor;\n" + // 光线颜色
  "uniform vec3 u_LightPosition;\n" + // 光源位置（世界坐标系）
  "uniform vec3 u_AmbientLight;\n" + // 环境光颜色
  "varying vec4 v_Color;\n" +
  "varying vec3 v_Normal;\n" +
  "varying vec3 v_Position;\n" +
  "void main() {\n" +
  "  vec3 normal = normalize(v_Normal);\n" +
  "  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n" +
  "  float nDotL = max(dot(lightDirection, normal), 0.0);\n" +
  "  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n" +
  "  vec3 ambient = u_AmbientLight * v_Color.rgb;\n" +
  "  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n" +
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
    console.log("Failed to initialize shaders.");
    return;
  }

  // 设置顶点位置
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the positions of the vertices");
    return;
  }

  // 设置背景色
  gl.clearColor(0, 0, 0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  var u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
  var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
  if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) {
    console.log("Failed to get the storage location of u_MvpMatrix");
    return;
  }

  // 设置光线颜色
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  var modelMatrix = new Matrix4();
  var mvpMatrix = new Matrix4();
  var normalMatrix = new Matrix4();

  modelMatrix.setRotate(90, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // 透视投影
  mvpMatrix.setPerspective(30, canvas.width / canvas.clientHeight, 1, 100);
  mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var vertices = new Float32Array([   // Coordinates
     2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
     2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
     2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
    -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
    -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
     2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
  ]);


  var colors = new Float32Array([    // Colors
    // 0.6, 0.6, 0.6,   0.6, 0.6, 0.6,   0.6, 0.6, 0.6,  0.6, 0.6, 0.6,     // v0-v1-v2-v3 front
    // 0.6, 0.6, 0.6,   0.6, 0.6, 0.6,   0.6, 0.6, 0.6,  0.6, 0.6, 0.6,     // v0-v3-v4-v5 right
    // 0.6, 0.6, 0.6,   0.6, 0.6, 0.6,   0.6, 0.6, 0.6,  0.6, 0.6, 0.6,     // v0-v1-v2-v3 front
    // 0.6, 0.6, 0.6,   0.6, 0.6, 0.6,   0.6, 0.6, 0.6,  0.6, 0.6, 0.6,     // v0-v3-v4-v5 right
    // 0.6, 0.6, 0.6,   0.6, 0.6, 0.6,   0.6, 0.6, 0.6,  0.6, 0.6, 0.6,     // v0-v1-v2-v3 front
    // 0.6, 0.6, 0.6,   0.6, 0.6, 0.6,   0.6, 0.6, 0.6,  0.6, 0.6, 0.6,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
 ]);


  var normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);


  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  // 创建缓冲区对象
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) {
    return -1;
  }

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) {
    return -1;
  }

  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) {
    return -1;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // 获取a_Position变量的存储位置
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log("Failed to get the storage location of" + a_attribute);
    return false;
  }

  // 将缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);

  // 连接a_Position变量与分配给他的缓冲区对象
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}

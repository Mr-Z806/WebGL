// 顶点着色器程序
var VSHADER_SOURCE =
  "void main() {\n" +
  "  gl_Position = vec4(0.5, 0.5, 0.0, 1.0);\n" + // 设置坐标
  "  gl_PointSize = 60.0;\n" + // 设置尺寸
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n" + // 设置颜色
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

  // 设置背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制一个点
  gl.drawArrays(gl.POINTS, 0, 1);
}

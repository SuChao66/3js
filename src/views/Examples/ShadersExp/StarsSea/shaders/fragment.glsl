#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision lowp float;
#endif

void main() {
  gl_FragColor = vec4(1.0, 1.0, 0.0,1.0);
}

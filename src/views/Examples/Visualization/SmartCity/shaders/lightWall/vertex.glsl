varying vec3 vPosition;

void main() {
  vec4 m_position = modelMatrix * vec4(position,1);
  vPosition = position;

  gl_Position = projectionMatrix * viewMatrix * m_position;
}

uniform float time;

void main() {
    float y = sin(position.x / 50.0 + time) * 5.0 + sin(position.y / 50.0 + time) * 5.0;
    vec3 newPosition = vec3(position.x, position.y, y * 2.0 );
    gl_PointSize = (y + 20.0) / 4.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}

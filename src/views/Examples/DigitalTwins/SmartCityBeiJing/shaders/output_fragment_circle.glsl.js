export default /* glsl */`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif

// 楼高范围
// 线性渐变
// vec3 gradient = mix(vec3(0.0, 0.1, 0.1), vec3(0.0, 1.0, 1.0), vPosition.z / 354.0);

// 非线性渐变，小部分楼层太高，不同高度矮楼层颜色对比不明显,可以采用非线性渐变方式调节
vec3 gradient = mix(vec3(0.0,0.1,0.1), vec3(0.0,1.0,1.0), sqrt(vPosition.z/354.0));

// 在光照影响明暗的基础上，设置渐变
// (避免模型材质color属性影响渐变色，设置为默认的纯白色即可)
outgoingLight = outgoingLight * gradient;

float r0 = 10.0 + time * 1000.0;
float w = 200.0; // 光带宽度一半，单位米
vec2 center = vec2(12953728.5, 4851891.5); // 圆心
float L = distance(vPosition.xy, center); // 距离圆心距离center
if(L > r0 && L < r0 + 2.0 * w){
    // 渐变色光带
    float per = 0.0;
    if(L < r0 + w){
        per = (L - r0) / w;
        outgoingLight = mix( outgoingLight, vec3(1.0,1.0,1.0), per);
    }else{
        per = (L - r0 - w) / w;
        outgoingLight = mix( vec3(1.0,1.0,1.0), outgoingLight, per);
    }
}

gl_FragColor = vec4( outgoingLight, diffuseColor.a );

// 不考虑漫反射材质光照计算的影响 不同面没有明暗变化  没有棱角感
// gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`;

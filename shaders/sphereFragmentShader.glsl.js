const sphereFragmentShader = `

uniform vec3 u_color;
uniform vec2 u_mouse;

uniform float u_time;
uniform vec3 u_light1_position;
uniform float u_light1_intensity;
uniform vec3 u_light1_color;
uniform vec3 u_light2_position;
uniform float u_light2_intensity;
uniform vec3 u_light2_color;
uniform vec3 u_light3_position;
uniform float u_light3_intensity;
uniform vec3 u_light3_color;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying float v_displacement;


vec3	calc_light(vec3 coords)
{
	float intensity1 = dot(coords, u_light1_position) * u_light1_intensity;
	float intensity2 = dot(coords, u_light2_position) * u_light2_intensity;
	float intensity3 = dot(coords, u_light3_position) * u_light3_intensity;
	return (u_color * u_light1_color * max(intensity1, 0.05)
			+ u_color * u_light2_color * max(intensity2, 0.05)
			+ u_color * u_light3_color * max(intensity3, 0.05));	
}

void	main()
{
	vec3 color = calc_light(v_normal * v_displacement);

	gl_FragColor = vec4(color, 1.0);
}
`;
export { sphereFragmentShader };

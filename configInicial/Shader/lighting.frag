#version 330 core
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform Material material;
uniform Light light;
uniform Light light2;

uniform sampler2D texture_diffuse;

void main()
{
    // Ambient
    vec3 ambient = light.ambient * material.diffuse;
    // Ambient 2
    vec3 ambient2 = light2.ambient * material.diffuse;
    // Se suman los dos vector de luz
    vec3 ambient_total = ambient + ambient2;

    // Diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 lightDir2 = normalize(light2.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    float diff2 = max(dot(norm, lightDir2), 0.0);
    vec3 diffuse = light.diffuse * diff * material.diffuse;
    vec3 diffuse2 = light2.diffuse * diff2 * material.diffuse;
    // Se suman los dos vectores finales;
    vec3 diffuse_total = diffuse + diffuse2;

    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 reflectDir2 = reflect(-lightDir2, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), material.shininess);
    vec3 specular = light.specular * (spec * material.specular);
    vec3 specular2 = light2.specular * (spec2 * material.specular);
    // Se suman los dos vectores finales
    vec3 specular_total = specular + specular2;

    vec3 result = ambient_total + diffuse_total + specular_total;
    color = vec4(result, 1.0f)*texture(texture_diffuse, TexCoords);
}



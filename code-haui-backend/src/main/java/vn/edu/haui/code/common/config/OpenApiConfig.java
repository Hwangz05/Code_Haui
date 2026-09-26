package vn.edu.haui.code.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CODE HAUI REST API - Nền Tảng Học & Thi Đấu Lập Trình")
                        .description("Tài liệu RESTful API cho hệ thống Code HaUI - Trường Đại học Công nghiệp Hà Nội. Kiến trúc Modular Monolith trên nền Java 25 & Spring Boot 3.4.x.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Đội ngũ Phát triển Code HaUI")
                                .email("contact@haui.edu.vn")
                                .url("https://haui.edu.vn"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Nhập JWT Token theo định dạng: Bearer {token}")));
    }
}

package vn.edu.haui.code;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CodeHauiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeHauiApplication.class, args);
    }
}

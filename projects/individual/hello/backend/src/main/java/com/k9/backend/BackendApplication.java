package com.k9.backend;

import com.k9.backend.models.Role;
import com.k9.backend.models.RoleName;
import com.k9.backend.repository.RoleRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(RoleRepository roleRepository){
        return (args -> {
            if(roleRepository.findByRoleName(RoleName.ROLE_USER).isEmpty()){
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_USER);
                roleRepository.save(role);
            }

            if(roleRepository.findByRoleName(RoleName.ROLE_ADMIN).isEmpty()){
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_ADMIN);
                roleRepository.save(role);
            }

            if(roleRepository.findByRoleName(RoleName.ROLE_MODERATOR).isEmpty()){
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_MODERATOR);
                roleRepository.save(role);
            }
        });
    }
}

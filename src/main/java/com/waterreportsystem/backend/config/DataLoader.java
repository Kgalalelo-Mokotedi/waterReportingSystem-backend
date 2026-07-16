package com.waterreportsystem.backend.config;

import com.waterreportsystem.backend.entity.Role;
import com.waterreportsystem.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        createRoleIfMissing("RESIDENT");
        createRoleIfMissing("ADMIN");
        createRoleIfMissing("TECHNICIAN");
    }

    private void createRoleIfMissing(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }
}
package com.waterreport.user;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * PLACEHOLDER — Member 1 owns the real UserRepository (with auth-related
 * query methods like findByEmail). This minimal version exists only so
 * this module's DataSeeder can create sample users to attach technician
 * profiles to. Delete once you merge in the real one.
 */
public interface UserRepository extends JpaRepository<User, Long> {
}

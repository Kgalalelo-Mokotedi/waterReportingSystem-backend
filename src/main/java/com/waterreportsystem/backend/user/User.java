package com.waterreport.user;

import jakarta.persistence.*;

/**
 * PLACEHOLDER — Member 1 (Backend Lead) owns the real User entity
 * (registration, roles, JWT fields, etc.).
 *
 * This stub only exists so the Technician & Admin module compiles and
 * can be developed/tested independently. Delete this file once you
 * pull in the real User entity from your teammate and just update the
 * import statements across this module (they all reference
 * com.waterreport.user.User).
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(length = 150, unique = true)
    private String email;

    // --- getters / setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

package hu.me.asnqph.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {

    @Id
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Embedded
    private Credentials credentials;

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    public User(long id, String name, Role role, Credentials credentials) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.credentials = credentials;
    }

}



package com.k9.backend.security.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.k9.backend.dtos.UserProfileDTO;
import com.k9.backend.models.Admin;
import com.k9.backend.models.Doctor;
import com.k9.backend.models.Nurse;
import com.k9.backend.models.Patient;
import com.k9.backend.models.User;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String username;

    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    private Admin admin;

    private Doctor doctor;

    private Nurse nurse;

    private Patient patient;

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getAdmin(),
                user.getDoctor(),
                user.getNurse(),
                user.getPatient());
    }

    public UserProfileDTO getUserProfileDTO() {
        if (this.admin != null) {
            return new UserProfileDTO(this.admin.getFullName());
        } else if (this.doctor != null) {
            return new UserProfileDTO(this.doctor.getFullName());
        } else if (this.nurse != null) {
            return new UserProfileDTO(this.nurse.getFullName());
        } else if (this.patient != null) {
            return new UserProfileDTO(this.patient.getFullName());
        } else {
            return null;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}

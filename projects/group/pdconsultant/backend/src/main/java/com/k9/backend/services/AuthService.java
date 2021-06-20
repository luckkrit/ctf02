package com.k9.backend.services;

import com.k9.backend.dtos.LoginEmailDTO;
import com.k9.backend.dtos.LoginResponseDTO;
import com.k9.backend.dtos.LoginUsernameDTO;
import com.k9.backend.dtos.RegisterDTO;
import com.k9.backend.dtos.RegisterErrorResponseDTO;
import com.k9.backend.dtos.RegisterResponseDTO;
import com.k9.backend.dtos.UserDTO;
import com.k9.backend.models.Admin;
import com.k9.backend.models.Doctor;
import com.k9.backend.models.Nurse;
import com.k9.backend.models.Patient;
import com.k9.backend.models.Role;
import com.k9.backend.models.RoleName;
import com.k9.backend.models.User;
import com.k9.backend.repository.RoleRepository;
import com.k9.backend.repository.UserRepository;
import com.k9.backend.security.jwt.JwtUtils;
import com.k9.backend.security.services.UserDetailsImpl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder encoder;

    private final JwtUtils jwtUtils;

    public LoginResponseDTO loginWithUsername(LoginUsernameDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        UserDTO userDTO = new UserDTO(userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles,
                userDetails.getUserProfileDTO());
        return new LoginResponseDTO(jwt, userDTO, true);
    }

    public LoginResponseDTO loginWithEmail(LoginEmailDTO loginRequest) {
        User user = this.userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (user == null) {
            return new LoginResponseDTO(null, null, false);
        } else {
            return loginWithUsername(new LoginUsernameDTO(user.getUsername(), loginRequest.getPassword()));
        }
    }

    public RegisterResponseDTO register(RegisterDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            return new RegisterResponseDTO(false, new RegisterErrorResponseDTO("userName", "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            return new RegisterResponseDTO(false, new RegisterErrorResponseDTO("email", "Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setUsername(registerDTO.getUsername());
        user.setPassword(encoder.encode(registerDTO.getPassword()));

        Set<String> strRoles = registerDTO.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByRoleName(RoleName.ROLE_PATIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            Patient patient = new Patient();
            patient.setRegisterDTO(registerDTO);
            patient.setUser(user);
            user.setPatient(patient);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        Admin admin = new Admin();
                        admin.setUser(user);
                        admin.setRegisterDTO(registerDTO);
                        user.setAdmin(admin);
                        break;
                    case "doctor":
                        Role doctorRole = roleRepository.findByRoleName(RoleName.ROLE_DOCTOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(doctorRole);
                        Doctor doctor = new Doctor();
                        doctor.setUser(user);
                        doctor.setRegisterDTO(registerDTO);
                        doctor.setSpecialty(registerDTO.getSpecialty());
                        user.setDoctor(doctor);
                        break;
                    case "nurse":
                        Role modRole = roleRepository.findByRoleName(RoleName.ROLE_NURSE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        Nurse nurse = new Nurse();
                        nurse.setUser(user);
                        nurse.setRegisterDTO(registerDTO);
                        user.setNurse(nurse);
                        break;
                    default:
                        Role userRole = roleRepository.findByRoleName(RoleName.ROLE_PATIENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                        Patient patient = new Patient();
                        patient.setRegisterDTO(registerDTO);
                        patient.setUser(user);
                        user.setPatient(patient);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        return new RegisterResponseDTO(true, null);
    }
}

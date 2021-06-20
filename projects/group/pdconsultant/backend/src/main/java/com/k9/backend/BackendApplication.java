package com.k9.backend;

import com.github.javafaker.Faker;
import com.k9.backend.dtos.RegisterDTO;
import com.k9.backend.models.Appointment;
import com.k9.backend.models.Chat;
import com.k9.backend.models.DoctorChatMessage;
import com.k9.backend.models.PatientChatMessage;
import com.k9.backend.models.Role;
import com.k9.backend.models.RoleName;
import com.k9.backend.models.Specialty;
import com.k9.backend.models.Symptom;
import com.k9.backend.models.Treatment;
import com.k9.backend.models.VdoCall;
import com.k9.backend.repository.AppointmentRepository;
import com.k9.backend.repository.ChatRepository;
import com.k9.backend.repository.DoctorChatMessageRepository;
import com.k9.backend.repository.PatientChatMessageRepository;
import com.k9.backend.repository.PatientRepository;
import com.k9.backend.repository.RoleRepository;
import com.k9.backend.repository.SpecialtyRepository;
import com.k9.backend.repository.SymptomRepository;
import com.k9.backend.repository.TreatmentRepository;
import com.k9.backend.repository.UserRepository;
import com.k9.backend.repository.VdoCallRepository;
import com.k9.backend.services.AuthService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initRoleData(RoleRepository roleRepository) {
        return (args -> {
            if (roleRepository.findByRoleName(RoleName.ROLE_PATIENT).isEmpty()) {
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_PATIENT);
                roleRepository.save(role);
            }

            if (roleRepository.findByRoleName(RoleName.ROLE_ADMIN).isEmpty()) {
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_ADMIN);
                roleRepository.save(role);
            }

            if (roleRepository.findByRoleName(RoleName.ROLE_NURSE).isEmpty()) {
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_NURSE);
                roleRepository.save(role);
            }

            if (roleRepository.findByRoleName(RoleName.ROLE_DOCTOR).isEmpty()) {
                Role role = new Role();
                role.setRoleName(RoleName.ROLE_DOCTOR);
                roleRepository.save(role);
            }
        });
    }

    @Bean
    CommandLineRunner initSymptomAndSpecialtyData(SymptomRepository symptomRepository, SpecialtyRepository specialtyRepository) {
        return args -> {
            if (specialtyRepository.findAll().isEmpty() && symptomRepository.findAll().isEmpty()) {

                String[] symptoms = new String[]{"โรคทั่วไป", "โรคเกี่ยวกับเด็ก", "โรคเกี่ยวกับระบบประสาท", "โรคเครียด", "โรคเกี่ยวกับผู้หญิง",
                        "โรคเกี่ยวกับเพศ", "โรคเกี่ยวกับผิวหนัง", "โรคทางโภชนาการ", "โรคเวชศาตร์ฟื้นฟู", "โรคที่เกี่ยวกับสัตว์เลี้ยง"};
                String[] specialties = new String[]{"แพทย์ทั่วไป", "แพทย์เด็ก", "แพทย์ศัลยประสาท", "จิตแพทย์", "นรีแพทย์",
                        "แพทย์ผู้เชี่ยวชาญทางเพศ", "แพทย์ความงาม", "แพทย์นักโภชนาการ", "แพทย์ผู้เชี่ยวชาญด้านการออกกำลังกาย", "สัตวแพทย์"};
                for (int i = 0; i < symptoms.length; i++) {
                    Symptom symptom = new Symptom();
                    symptom.setTitle(symptoms[i]);
                    Specialty specialty = new Specialty();
                    specialty.setTitle(specialties[i]);
                    symptom.setSpecialty(specialty);
                    specialty.setSymptom(symptom);
                    specialtyRepository.save(specialty);
                }
            }
        };
    }

    @Bean
    CommandLineRunner initUserData(AuthService authService, UserRepository userRepository, SpecialtyRepository specialtyRepository) {
        return args -> {
            RegisterDTO registerDTO = new RegisterDTO();
            registerDTO.setUsername("admin");
            registerDTO.setFullName(new Faker().name().fullName());
            registerDTO.setPassword("12345678");
            registerDTO.setRole(new HashSet<>(Collections.singletonList("admin")));
            registerDTO.setEmail("admin@admin.com");
            if (!userRepository.existsByUsername(registerDTO.getUsername())) {
                authService.register(registerDTO);
            }
            Queue<Specialty> specialties = new LinkedList<>(specialtyRepository.findAll());
            for (int i = 1; i < 11; i++) {
                // Doctor
                registerDTO.setEmail(String.format("doctor%d@doctor.com", i));
                registerDTO.setUsername(String.format("doctor%d", i));
                registerDTO.setRole(new HashSet<>(Collections.singletonList("doctor")));
                registerDTO.setFullName(new Faker().name().fullName());
                registerDTO.setSpecialty(specialties.poll());
                if (!userRepository.existsByUsername(registerDTO.getUsername())) {
                    authService.register(registerDTO);
                }
                if (i == 1 || i == 2) {
                    // Nurse
                    registerDTO.setEmail(String.format("nurse%d@nurse.com", i));
                    registerDTO.setUsername(String.format("nurse%d", i));
                    registerDTO.setRole(new HashSet<>(Collections.singletonList("nurse")));
                    registerDTO.setFullName(new Faker().name().fullName());
                    if (!userRepository.existsByUsername(registerDTO.getUsername())) {
                        authService.register(registerDTO);
                    }
                    // Patient
                    registerDTO.setEmail(String.format("patient%d@patient.com", i));
                    registerDTO.setUsername(String.format("patient%d", i));
                    registerDTO.setRole(new HashSet<>(Collections.singletonList("patient")));
                    registerDTO.setFullName(new Faker().name().fullName());
                    if (!userRepository.existsByUsername(registerDTO.getUsername())) {
                        authService.register(registerDTO);
                    }
                }
            }
        };
    }

    @Bean
    CommandLineRunner initAppointmentData(AppointmentRepository appointmentRepository, SymptomRepository symptomRepository, PatientRepository patientRepository) {
        return args -> {
            if (appointmentRepository.findAll().isEmpty()) {
                symptomRepository.findAll().forEach(symptom -> symptom.getSpecialty().getDoctors().forEach(doctor -> patientRepository.findAll().forEach(patient -> {
                    Appointment appointment = new Appointment();
                    appointment.setSymptom(symptom);
                    appointment.setDoctor(doctor);
                    appointment.setDateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
                    doctor.getAppointments().add(appointment);
                    symptom.getAppointments().add(appointment);
                    appointment.setPatient(patient);
                    patient.getAppointments().add(appointment);
                    appointmentRepository.save(appointment);
                })));
            }
        };
    }

    @Bean
    CommandLineRunner initTreatmentData(TreatmentRepository treatmentRepository, AppointmentRepository appointmentRepository) {
        return args -> {
            if (treatmentRepository.findAll().isEmpty()) {
                List<Appointment> appointments = appointmentRepository.findAll();
                for (int i = 0; i < appointments.size(); i++) {
                    Appointment appointment = appointments.get(i);
                    Treatment treatment = new Treatment();
                    treatment.setDescription(String.format("Treatment%d", i + 1));
                    appointment.setTreatment(treatment);
                    treatment.setAppointment(appointment);
                    appointmentRepository.save(appointment);
                }
            }
        };
    }

    @Bean
    CommandLineRunner initChatData(TreatmentRepository treatmentRepository, ChatRepository chatRepository, PatientChatMessageRepository patientChatMessageRepository, DoctorChatMessageRepository doctorChatMessageRepository) {
        return args -> {
            if (chatRepository.findAll().isEmpty()) {
                List<Treatment> treatments = treatmentRepository.findAll();
                for (Treatment treatment : treatments) {
                    Chat chat = new Chat();
                    treatment.setChat(chat);
                    chat.setTreatment(treatment);
                    chatRepository.save(chat);
                    treatmentRepository.save(treatment);
                    for (int j = 1; j < 11; j++) {
                        if (j % 2 == 1) {
                            DoctorChatMessage doctorChatMessage = new DoctorChatMessage();
                            doctorChatMessage.setDoctor(treatment.getAppointment().getDoctor());
                            doctorChatMessage.setChat(chat);
                            doctorChatMessage.setMessage(String.format("message %d", j));
                            doctorChatMessageRepository.save(doctorChatMessage);
                        } else {
                            PatientChatMessage patientChatMessage = new PatientChatMessage();
                            patientChatMessage.setPatient(treatment.getAppointment().getPatient());
                            patientChatMessage.setMessage(String.format("message %d", j));
                            patientChatMessage.setChat(chat);
                            patientChatMessageRepository.save(patientChatMessage);
                        }
                    }
                }
            }
        };
    }

    @Bean
    CommandLineRunner initVdoCallData(TreatmentRepository treatmentRepository, VdoCallRepository vdoCallRepository) {
        return args -> {
            if (vdoCallRepository.findAll().isEmpty()) {
                List<Treatment> treatments = treatmentRepository.findAll();
                for (int i = 0; i < treatments.size(); i++) {
                    Treatment treatment = treatments.get(i);
                    VdoCall vdoCall = new VdoCall();
                    vdoCall.setTreatment(treatment);
                    treatment.setVdoCall(vdoCall);
                    treatmentRepository.save(treatment);
                }
            }
        };
    }
}

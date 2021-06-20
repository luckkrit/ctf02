package com.k9.backend.repository;

import com.k9.backend.models.PatientChatMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientChatMessageRepository extends JpaRepository<PatientChatMessage, Long> {
}

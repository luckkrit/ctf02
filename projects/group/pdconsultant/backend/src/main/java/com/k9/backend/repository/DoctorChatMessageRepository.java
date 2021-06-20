package com.k9.backend.repository;

import com.k9.backend.models.DoctorChatMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorChatMessageRepository extends JpaRepository<DoctorChatMessage, Long> {
}

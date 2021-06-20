package com.k9.backend.repository;

import com.k9.backend.models.VdoCall;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VdoCallRepository extends JpaRepository<VdoCall, Long> {
}

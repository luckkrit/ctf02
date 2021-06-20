package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "vdo_call", indexes = @Index(columnList = "id, password,"))
@NoArgsConstructor
@AllArgsConstructor
@Data
public class VdoCall {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String password = UUID.randomUUID().toString();

    @OneToOne(mappedBy = "vdoCall")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    private Treatment treatment;
}

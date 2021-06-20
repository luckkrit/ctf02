package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "symptom", indexes = @Index(columnList = "title, specialty_id"))
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Symptom {
    @Id
    private Long id;

    private String title;
    @OneToOne
    @MapsId
    @JsonBackReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Specialty specialty;

    @OneToMany(mappedBy = "symptom", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    private Set<Appointment> appointments;

}

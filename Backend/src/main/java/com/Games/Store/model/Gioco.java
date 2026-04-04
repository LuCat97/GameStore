package com.Games.Store.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table (name="giochi")
public class Gioco {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(nullable=false, length=100)
	private String titolo;
	@Column(nullable=false, length=50)
	private String piattaforma;
	@Column(nullable=false, length=30)
	private String genere;
	@Column(length=30)
	private String stato;
	@Column(precision=5, scale=2)
	private BigDecimal oreGiocate;
	@Column(precision=3, scale=1)
	private BigDecimal voto;
	
	private LocalDate dataAcquisto;
	@Column (length=500)
	private String note;
	@Column(length = 500)
	private String immagine;
	
}

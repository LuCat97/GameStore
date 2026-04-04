package com.Games.Store.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Games.Store.model.Gioco;

public interface GiocoRepository extends JpaRepository<Gioco,Integer> {

	
	public List<Gioco> findByGenereContainingIgnoreCase(String genere);
	
	public List<Gioco> findByTitoloContainingIgnoreCase(String titolo);
	
	public List<Gioco> findByVotoGreaterThan(BigDecimal voto);
	
	public List<Gioco> findByPiattaformaContainingIgnoreCase(String piattaforma);
	
	public List<Gioco> findByStato(String stato);
}

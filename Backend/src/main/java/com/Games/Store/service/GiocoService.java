package com.Games.Store.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Games.Store.exception.ResourceNotFoundException;
import com.Games.Store.model.Gioco;
import com.Games.Store.repository.GiocoRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GiocoService {
	
	@Autowired
	private GiocoRepository repository;
	
	
	public List<Gioco> getAllGiochi() {
		return repository.findAll();
	}
	
	public Gioco getById(Integer id) {
		return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Nessun gioco trovato con id: "+id));
	}

	public List<Gioco> getByTitolo (String titolo){
		return repository.findByTitoloContainingIgnoreCase(titolo);
	}
	
	public List<Gioco> getByGenere (String genere){
		return repository.findByGenereContainingIgnoreCase(genere);
	}
	
	public List<Gioco> getByVoto (BigDecimal voto){
		return repository.findByVotoGreaterThan(voto);
	}
	
	public List<Gioco> getByPiattaforma (String piattaforma){
		return repository.findByPiattaformaContainingIgnoreCase(piattaforma);
	}
	
	public List<Gioco> getByStato (String stato){
		return repository.findByStato(stato);
	}
	
	public Gioco createGioco(Gioco g) {
		return repository.save(g);
	}
	
	public void deleteGioco (Integer id) {	
		 repository.deleteById(id);
	}
	
	
	public Gioco updateGioco(Integer id, Gioco giocoAggiornato) {
	    if (id == null) {
	        throw new IllegalArgumentException("ID nullo arrivato al service");
	    }
	    Gioco gioco = repository.findById(id)
	        .orElseThrow(() -> new RuntimeException("Gioco non trovato con id: " + id));

	    gioco.setTitolo(giocoAggiornato.getTitolo());
	    gioco.setGenere(giocoAggiornato.getGenere());
	    gioco.setPiattaforma(giocoAggiornato.getPiattaforma());
	    gioco.setStato(giocoAggiornato.getStato());
	    gioco.setOreGiocate(giocoAggiornato.getOreGiocate());
	    gioco.setVoto(giocoAggiornato.getVoto());
	    gioco.setDataAcquisto(giocoAggiornato.getDataAcquisto());
	    gioco.setNote(giocoAggiornato.getNote());
	    gioco.setImmagine(giocoAggiornato.getImmagine());
	    
	    return repository.save(gioco);
	}
	
}

package com.Games.Store.controller;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Games.Store.model.Gioco;
import com.Games.Store.service.GiocoService;


@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/giochi")
public class GiocoController {
	
	@Autowired
	private GiocoService service;
	
	@PostMapping
	public Gioco create(@RequestBody Gioco g) {
		return service.createGioco(g);
	}

	@GetMapping
	public List<Gioco> getAll(){
	    return service.getAllGiochi();
	}
	
	@GetMapping("/{id}")
	public Gioco getById(@PathVariable Integer id) {
		return service.getById(id);
	}
	
	@GetMapping("/pertitolo/{titolo}")
	public List<Gioco> getByTitolo(@PathVariable String titolo) {
		return service.getByTitolo(titolo);
	}
	
	@GetMapping("/pergenere/{genere}")
	public List<Gioco> getByGenere(@PathVariable String genere) {
		return service.getByGenere(genere);
	}
	
	@GetMapping("/perstato/{stato}")
	public List<Gioco> getByStato(@PathVariable String stato) {
		return service.getByStato(stato);
	}
	
	@GetMapping("/perpiattaforma/{piattaforma}")
	public List<Gioco> getByPiattaforma(@PathVariable String piattaforma) {
		return service.getByPiattaforma(piattaforma);
	}
	
	@GetMapping("/pervoto/{voto}")
	public List<Gioco> getByVoto(@PathVariable BigDecimal voto) {
		return service.getByVoto(voto);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Gioco> update(@PathVariable("id") Integer id, @RequestBody Gioco gioco) {
	    Gioco updated = service.updateGioco(id, gioco);
	    return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
	    service.deleteGioco(id);
	    return ResponseEntity.noContent().build();
	}
	

}

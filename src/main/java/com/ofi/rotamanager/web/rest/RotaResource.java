package com.ofi.rotamanager.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ofi.rotamanager.domain.Rota;
import com.ofi.rotamanager.repository.RotaRepository;
import com.ofi.rotamanager.repository.search.RotaSearchRepository;
import com.ofi.rotamanager.web.rest.util.HeaderUtil;
import com.ofi.rotamanager.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Rota.
 */
@RestController
@RequestMapping("/api")
public class RotaResource {

    private final Logger log = LoggerFactory.getLogger(RotaResource.class);
        
    @Inject
    private RotaRepository rotaRepository;
    
    @Inject
    private RotaSearchRepository rotaSearchRepository;
    
    /**
     * POST  /rotas : Create a new rota.
     *
     * @param rota the rota to create
     * @return the ResponseEntity with status 201 (Created) and with body the new rota, or with status 400 (Bad Request) if the rota has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/rotas",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Rota> createRota(@Valid @RequestBody Rota rota) throws URISyntaxException {
        log.debug("REST request to save Rota : {}", rota);
        if (rota.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("rota", "idexists", "A new rota cannot already have an ID")).body(null);
        }
        Rota result = rotaRepository.save(rota);
        rotaSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/rotas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("rota", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /rotas : Updates an existing rota.
     *
     * @param rota the rota to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated rota,
     * or with status 400 (Bad Request) if the rota is not valid,
     * or with status 500 (Internal Server Error) if the rota couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/rotas",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Rota> updateRota(@Valid @RequestBody Rota rota) throws URISyntaxException {
        log.debug("REST request to update Rota : {}", rota);
        if (rota.getId() == null) {
            return createRota(rota);
        }
        Rota result = rotaRepository.save(rota);
        rotaSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("rota", rota.getId().toString()))
            .body(result);
    }

    /**
     * GET  /rotas : get all the rotas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of rotas in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/rotas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Rota>> getAllRotas(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Rotas");
        Page<Rota> page = rotaRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/rotas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /rotas/:id : get the "id" rota.
     *
     * @param id the id of the rota to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the rota, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/rotas/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Rota> getRota(@PathVariable Long id) {
        log.debug("REST request to get Rota : {}", id);
        Rota rota = rotaRepository.findOne(id);
        return Optional.ofNullable(rota)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /rotas/:id : delete the "id" rota.
     *
     * @param id the id of the rota to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/rotas/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteRota(@PathVariable Long id) {
        log.debug("REST request to delete Rota : {}", id);
        rotaRepository.delete(id);
        rotaSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("rota", id.toString())).build();
    }

    /**
     * SEARCH  /_search/rotas?query=:query : search for the rota corresponding
     * to the query.
     *
     * @param query the query of the rota search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/rotas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Rota>> searchRotas(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Rotas for query {}", query);
        Page<Rota> page = rotaSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/rotas");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

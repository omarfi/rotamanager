package com.ofi.rotamanager.web.rest;

import com.ofi.rotamanager.RotamanagerApp;
import com.ofi.rotamanager.domain.Rota;
import com.ofi.rotamanager.repository.RotaRepository;
import com.ofi.rotamanager.repository.search.RotaSearchRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the RotaResource REST controller.
 *
 * @see RotaResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = RotamanagerApp.class)
@WebAppConfiguration
@IntegrationTest
public class RotaResourceIntTest {


    private static final Integer DEFAULT_MONTH = 1;
    private static final Integer UPDATED_MONTH = 2;

    private static final Integer DEFAULT_YEAR = 1;
    private static final Integer UPDATED_YEAR = 2;

    @Inject
    private RotaRepository rotaRepository;

    @Inject
    private RotaSearchRepository rotaSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restRotaMockMvc;

    private Rota rota;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        RotaResource rotaResource = new RotaResource();
        ReflectionTestUtils.setField(rotaResource, "rotaSearchRepository", rotaSearchRepository);
        ReflectionTestUtils.setField(rotaResource, "rotaRepository", rotaRepository);
        this.restRotaMockMvc = MockMvcBuilders.standaloneSetup(rotaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        rotaSearchRepository.deleteAll();
        rota = new Rota();
        rota.setMonth(DEFAULT_MONTH);
        rota.setYear(DEFAULT_YEAR);
    }

    @Test
    @Transactional
    public void createRota() throws Exception {
        int databaseSizeBeforeCreate = rotaRepository.findAll().size();

        // Create the Rota

        restRotaMockMvc.perform(post("/api/rotas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(rota)))
                .andExpect(status().isCreated());

        // Validate the Rota in the database
        List<Rota> rotas = rotaRepository.findAll();
        assertThat(rotas).hasSize(databaseSizeBeforeCreate + 1);
        Rota testRota = rotas.get(rotas.size() - 1);
        assertThat(testRota.getMonth()).isEqualTo(DEFAULT_MONTH);
        assertThat(testRota.getYear()).isEqualTo(DEFAULT_YEAR);

        // Validate the Rota in ElasticSearch
        Rota rotaEs = rotaSearchRepository.findOne(testRota.getId());
        assertThat(rotaEs).isEqualToComparingFieldByField(testRota);
    }

    @Test
    @Transactional
    public void checkMonthIsRequired() throws Exception {
        int databaseSizeBeforeTest = rotaRepository.findAll().size();
        // set the field null
        rota.setMonth(null);

        // Create the Rota, which fails.

        restRotaMockMvc.perform(post("/api/rotas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(rota)))
                .andExpect(status().isBadRequest());

        List<Rota> rotas = rotaRepository.findAll();
        assertThat(rotas).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkYearIsRequired() throws Exception {
        int databaseSizeBeforeTest = rotaRepository.findAll().size();
        // set the field null
        rota.setYear(null);

        // Create the Rota, which fails.

        restRotaMockMvc.perform(post("/api/rotas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(rota)))
                .andExpect(status().isBadRequest());

        List<Rota> rotas = rotaRepository.findAll();
        assertThat(rotas).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRotas() throws Exception {
        // Initialize the database
        rotaRepository.saveAndFlush(rota);

        // Get all the rotas
        restRotaMockMvc.perform(get("/api/rotas?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(rota.getId().intValue())))
                .andExpect(jsonPath("$.[*].month").value(hasItem(DEFAULT_MONTH)))
                .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)));
    }

    @Test
    @Transactional
    public void getRota() throws Exception {
        // Initialize the database
        rotaRepository.saveAndFlush(rota);

        // Get the rota
        restRotaMockMvc.perform(get("/api/rotas/{id}", rota.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(rota.getId().intValue()))
            .andExpect(jsonPath("$.month").value(DEFAULT_MONTH))
            .andExpect(jsonPath("$.year").value(DEFAULT_YEAR));
    }

    @Test
    @Transactional
    public void getNonExistingRota() throws Exception {
        // Get the rota
        restRotaMockMvc.perform(get("/api/rotas/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRota() throws Exception {
        // Initialize the database
        rotaRepository.saveAndFlush(rota);
        rotaSearchRepository.save(rota);
        int databaseSizeBeforeUpdate = rotaRepository.findAll().size();

        // Update the rota
        Rota updatedRota = new Rota();
        updatedRota.setId(rota.getId());
        updatedRota.setMonth(UPDATED_MONTH);
        updatedRota.setYear(UPDATED_YEAR);

        restRotaMockMvc.perform(put("/api/rotas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedRota)))
                .andExpect(status().isOk());

        // Validate the Rota in the database
        List<Rota> rotas = rotaRepository.findAll();
        assertThat(rotas).hasSize(databaseSizeBeforeUpdate);
        Rota testRota = rotas.get(rotas.size() - 1);
        assertThat(testRota.getMonth()).isEqualTo(UPDATED_MONTH);
        assertThat(testRota.getYear()).isEqualTo(UPDATED_YEAR);

        // Validate the Rota in ElasticSearch
        Rota rotaEs = rotaSearchRepository.findOne(testRota.getId());
        assertThat(rotaEs).isEqualToComparingFieldByField(testRota);
    }

    @Test
    @Transactional
    public void deleteRota() throws Exception {
        // Initialize the database
        rotaRepository.saveAndFlush(rota);
        rotaSearchRepository.save(rota);
        int databaseSizeBeforeDelete = rotaRepository.findAll().size();

        // Get the rota
        restRotaMockMvc.perform(delete("/api/rotas/{id}", rota.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean rotaExistsInEs = rotaSearchRepository.exists(rota.getId());
        assertThat(rotaExistsInEs).isFalse();

        // Validate the database is empty
        List<Rota> rotas = rotaRepository.findAll();
        assertThat(rotas).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchRota() throws Exception {
        // Initialize the database
        rotaRepository.saveAndFlush(rota);
        rotaSearchRepository.save(rota);

        // Search the rota
        restRotaMockMvc.perform(get("/api/_search/rotas?query=id:" + rota.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rota.getId().intValue())))
            .andExpect(jsonPath("$.[*].month").value(hasItem(DEFAULT_MONTH)))
            .andExpect(jsonPath("$.[*].year").value(hasItem(DEFAULT_YEAR)));
    }
}

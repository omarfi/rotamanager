package com.ofi.rotamanager.web.rest;

import com.ofi.rotamanager.RotamanagerApp;
import com.ofi.rotamanager.domain.Shift;
import com.ofi.rotamanager.repository.ShiftRepository;
import com.ofi.rotamanager.repository.search.ShiftSearchRepository;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the ShiftResource REST controller.
 *
 * @see ShiftResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = RotamanagerApp.class)
@WebAppConfiguration
@IntegrationTest
public class ShiftResourceIntTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").withZone(ZoneId.of("Z"));


    private static final ZonedDateTime DEFAULT_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_START_STR = dateTimeFormatter.format(DEFAULT_START);

    private static final ZonedDateTime DEFAULT_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_END_STR = dateTimeFormatter.format(DEFAULT_END);

    @Inject
    private ShiftRepository shiftRepository;

    @Inject
    private ShiftSearchRepository shiftSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restShiftMockMvc;

    private Shift shift;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ShiftResource shiftResource = new ShiftResource();
        ReflectionTestUtils.setField(shiftResource, "shiftSearchRepository", shiftSearchRepository);
        ReflectionTestUtils.setField(shiftResource, "shiftRepository", shiftRepository);
        this.restShiftMockMvc = MockMvcBuilders.standaloneSetup(shiftResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        shiftSearchRepository.deleteAll();
        shift = new Shift();
        shift.setStart(DEFAULT_START);
        shift.setEnd(DEFAULT_END);
    }

    @Test
    @Transactional
    public void createShift() throws Exception {
        int databaseSizeBeforeCreate = shiftRepository.findAll().size();

        // Create the Shift

        restShiftMockMvc.perform(post("/api/shifts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(shift)))
                .andExpect(status().isCreated());

        // Validate the Shift in the database
        List<Shift> shifts = shiftRepository.findAll();
        assertThat(shifts).hasSize(databaseSizeBeforeCreate + 1);
        Shift testShift = shifts.get(shifts.size() - 1);
        assertThat(testShift.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testShift.getEnd()).isEqualTo(DEFAULT_END);

        // Validate the Shift in ElasticSearch
        Shift shiftEs = shiftSearchRepository.findOne(testShift.getId());
        assertThat(shiftEs).isEqualToComparingFieldByField(testShift);
    }

    @Test
    @Transactional
    public void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = shiftRepository.findAll().size();
        // set the field null
        shift.setStart(null);

        // Create the Shift, which fails.

        restShiftMockMvc.perform(post("/api/shifts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(shift)))
                .andExpect(status().isBadRequest());

        List<Shift> shifts = shiftRepository.findAll();
        assertThat(shifts).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = shiftRepository.findAll().size();
        // set the field null
        shift.setEnd(null);

        // Create the Shift, which fails.

        restShiftMockMvc.perform(post("/api/shifts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(shift)))
                .andExpect(status().isBadRequest());

        List<Shift> shifts = shiftRepository.findAll();
        assertThat(shifts).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllShifts() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        // Get all the shifts
        restShiftMockMvc.perform(get("/api/shifts?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(shift.getId().intValue())))
                .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START_STR)))
                .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END_STR)));
    }

    @Test
    @Transactional
    public void getShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);

        // Get the shift
        restShiftMockMvc.perform(get("/api/shifts/{id}", shift.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(shift.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START_STR))
            .andExpect(jsonPath("$.end").value(DEFAULT_END_STR));
    }

    @Test
    @Transactional
    public void getNonExistingShift() throws Exception {
        // Get the shift
        restShiftMockMvc.perform(get("/api/shifts/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);
        shiftSearchRepository.save(shift);
        int databaseSizeBeforeUpdate = shiftRepository.findAll().size();

        // Update the shift
        Shift updatedShift = new Shift();
        updatedShift.setId(shift.getId());
        updatedShift.setStart(UPDATED_START);
        updatedShift.setEnd(UPDATED_END);

        restShiftMockMvc.perform(put("/api/shifts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedShift)))
                .andExpect(status().isOk());

        // Validate the Shift in the database
        List<Shift> shifts = shiftRepository.findAll();
        assertThat(shifts).hasSize(databaseSizeBeforeUpdate);
        Shift testShift = shifts.get(shifts.size() - 1);
        assertThat(testShift.getStart()).isEqualTo(UPDATED_START);
        assertThat(testShift.getEnd()).isEqualTo(UPDATED_END);

        // Validate the Shift in ElasticSearch
        Shift shiftEs = shiftSearchRepository.findOne(testShift.getId());
        assertThat(shiftEs).isEqualToComparingFieldByField(testShift);
    }

    @Test
    @Transactional
    public void deleteShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);
        shiftSearchRepository.save(shift);
        int databaseSizeBeforeDelete = shiftRepository.findAll().size();

        // Get the shift
        restShiftMockMvc.perform(delete("/api/shifts/{id}", shift.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean shiftExistsInEs = shiftSearchRepository.exists(shift.getId());
        assertThat(shiftExistsInEs).isFalse();

        // Validate the database is empty
        List<Shift> shifts = shiftRepository.findAll();
        assertThat(shifts).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchShift() throws Exception {
        // Initialize the database
        shiftRepository.saveAndFlush(shift);
        shiftSearchRepository.save(shift);

        // Search the shift
        restShiftMockMvc.perform(get("/api/_search/shifts?query=id:" + shift.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shift.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START_STR)))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END_STR)));
    }
}

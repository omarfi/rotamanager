package com.ofi.rotamanager.web.rest;

import com.ofi.rotamanager.RotamanagerApp;
import com.ofi.rotamanager.domain.Store;
import com.ofi.rotamanager.repository.StoreRepository;
import com.ofi.rotamanager.service.StoreService;
import com.ofi.rotamanager.repository.search.StoreSearchRepository;

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
 * Test class for the StoreResource REST controller.
 *
 * @see StoreResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = RotamanagerApp.class)
@WebAppConfiguration
@IntegrationTest
public class StoreResourceIntTest {


    private static final Integer DEFAULT_STORE_ID_EXTERNAL = 1;
    private static final Integer UPDATED_STORE_ID_EXTERNAL = 2;
    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_EMAIL = "AAAAA";
    private static final String UPDATED_EMAIL = "BBBBB";

    @Inject
    private StoreRepository storeRepository;

    @Inject
    private StoreService storeService;

    @Inject
    private StoreSearchRepository storeSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restStoreMockMvc;

    private Store store;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        StoreResource storeResource = new StoreResource();
        ReflectionTestUtils.setField(storeResource, "storeService", storeService);
        this.restStoreMockMvc = MockMvcBuilders.standaloneSetup(storeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        storeSearchRepository.deleteAll();
        store = new Store();
        store.setStoreIdExternal(DEFAULT_STORE_ID_EXTERNAL);
        store.setName(DEFAULT_NAME);
        store.setEmail(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createStore() throws Exception {
        int databaseSizeBeforeCreate = storeRepository.findAll().size();

        // Create the Store

        restStoreMockMvc.perform(post("/api/stores")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(store)))
                .andExpect(status().isCreated());

        // Validate the Store in the database
        List<Store> stores = storeRepository.findAll();
        assertThat(stores).hasSize(databaseSizeBeforeCreate + 1);
        Store testStore = stores.get(stores.size() - 1);
        assertThat(testStore.getStoreIdExternal()).isEqualTo(DEFAULT_STORE_ID_EXTERNAL);
        assertThat(testStore.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStore.getEmail()).isEqualTo(DEFAULT_EMAIL);

        // Validate the Store in ElasticSearch
        Store storeEs = storeSearchRepository.findOne(testStore.getId());
        assertThat(storeEs).isEqualToComparingFieldByField(testStore);
    }

    @Test
    @Transactional
    public void checkStoreIdExternalIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeRepository.findAll().size();
        // set the field null
        store.setStoreIdExternal(null);

        // Create the Store, which fails.

        restStoreMockMvc.perform(post("/api/stores")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(store)))
                .andExpect(status().isBadRequest());

        List<Store> stores = storeRepository.findAll();
        assertThat(stores).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeRepository.findAll().size();
        // set the field null
        store.setName(null);

        // Create the Store, which fails.

        restStoreMockMvc.perform(post("/api/stores")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(store)))
                .andExpect(status().isBadRequest());

        List<Store> stores = storeRepository.findAll();
        assertThat(stores).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeRepository.findAll().size();
        // set the field null
        store.setEmail(null);

        // Create the Store, which fails.

        restStoreMockMvc.perform(post("/api/stores")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(store)))
                .andExpect(status().isBadRequest());

        List<Store> stores = storeRepository.findAll();
        assertThat(stores).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStores() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        // Get all the stores
        restStoreMockMvc.perform(get("/api/stores?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(store.getId().intValue())))
                .andExpect(jsonPath("$.[*].storeIdExternal").value(hasItem(DEFAULT_STORE_ID_EXTERNAL)))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }

    @Test
    @Transactional
    public void getStore() throws Exception {
        // Initialize the database
        storeRepository.saveAndFlush(store);

        // Get the store
        restStoreMockMvc.perform(get("/api/stores/{id}", store.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(store.getId().intValue()))
            .andExpect(jsonPath("$.storeIdExternal").value(DEFAULT_STORE_ID_EXTERNAL))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingStore() throws Exception {
        // Get the store
        restStoreMockMvc.perform(get("/api/stores/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStore() throws Exception {
        // Initialize the database
        storeService.save(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store
        Store updatedStore = new Store();
        updatedStore.setId(store.getId());
        updatedStore.setStoreIdExternal(UPDATED_STORE_ID_EXTERNAL);
        updatedStore.setName(UPDATED_NAME);
        updatedStore.setEmail(UPDATED_EMAIL);

        restStoreMockMvc.perform(put("/api/stores")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedStore)))
                .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> stores = storeRepository.findAll();
        assertThat(stores).hasSize(databaseSizeBeforeUpdate);
        Store testStore = stores.get(stores.size() - 1);
        assertThat(testStore.getStoreIdExternal()).isEqualTo(UPDATED_STORE_ID_EXTERNAL);
        assertThat(testStore.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStore.getEmail()).isEqualTo(UPDATED_EMAIL);

        // Validate the Store in ElasticSearch
        Store storeEs = storeSearchRepository.findOne(testStore.getId());
        assertThat(storeEs).isEqualToComparingFieldByField(testStore);
    }

    @Test
    @Transactional
    public void deleteStore() throws Exception {
        // Initialize the database
        storeService.save(store);

        int databaseSizeBeforeDelete = storeRepository.findAll().size();

        // Get the store
        restStoreMockMvc.perform(delete("/api/stores/{id}", store.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean storeExistsInEs = storeSearchRepository.exists(store.getId());
        assertThat(storeExistsInEs).isFalse();

        // Validate the database is empty
        List<Store> stores = storeRepository.findAll();
        assertThat(stores).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchStore() throws Exception {
        // Initialize the database
        storeService.save(store);

        // Search the store
        restStoreMockMvc.perform(get("/api/_search/stores?query=id:" + store.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(store.getId().intValue())))
            .andExpect(jsonPath("$.[*].storeIdExternal").value(hasItem(DEFAULT_STORE_ID_EXTERNAL)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }
}

package com.ofi.rotamanager.repository.search;

import com.ofi.rotamanager.domain.Shift;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Shift entity.
 */
public interface ShiftSearchRepository extends ElasticsearchRepository<Shift, Long> {
}

package com.ofi.rotamanager.repository.search;

import com.ofi.rotamanager.domain.Rota;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Rota entity.
 */
public interface RotaSearchRepository extends ElasticsearchRepository<Rota, Long> {
}

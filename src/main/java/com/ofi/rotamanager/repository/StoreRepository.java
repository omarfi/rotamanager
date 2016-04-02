package com.ofi.rotamanager.repository;

import com.ofi.rotamanager.domain.Store;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Store entity.
 */
public interface StoreRepository extends JpaRepository<Store,Long> {

    @Query("select distinct store from Store store left join fetch store.employeess")
    List<Store> findAllWithEagerRelationships();

    @Query("select store from Store store left join fetch store.employeess where store.id =:id")
    Store findOneWithEagerRelationships(@Param("id") Long id);

}

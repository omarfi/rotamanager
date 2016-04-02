package com.ofi.rotamanager.repository;

import com.ofi.rotamanager.domain.Rota;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Rota entity.
 */
public interface RotaRepository extends JpaRepository<Rota,Long> {

}

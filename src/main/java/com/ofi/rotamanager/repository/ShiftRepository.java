package com.ofi.rotamanager.repository;

import com.ofi.rotamanager.domain.Shift;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Shift entity.
 */
public interface ShiftRepository extends JpaRepository<Shift,Long> {

}

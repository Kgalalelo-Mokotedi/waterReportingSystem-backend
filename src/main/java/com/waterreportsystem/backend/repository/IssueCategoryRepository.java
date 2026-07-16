package com.waterreportsystem.backend.repository;

import com.waterreportsystem.backend.entity.IssueCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueCategoryRepository extends JpaRepository<IssueCategory, Long> {
}
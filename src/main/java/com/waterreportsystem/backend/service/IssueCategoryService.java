package com.waterreportsystem.backend.service;

import com.waterreportsystem.backend.dto.IssueCategoryRequest;
import com.waterreportsystem.backend.dto.IssueCategoryResponse;

import java.util.List;

public interface IssueCategoryService {

    IssueCategoryResponse createCategory(IssueCategoryRequest request);

    List<IssueCategoryResponse> getAllCategories();

    IssueCategoryResponse getCategoryById(Long id);

    IssueCategoryResponse updateCategory(Long id, IssueCategoryRequest request);

    void deleteCategory(Long id);
}
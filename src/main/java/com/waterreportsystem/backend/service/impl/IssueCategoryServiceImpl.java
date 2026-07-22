package com.waterreportsystem.backend.service.impl;

import com.waterreportsystem.backend.dto.IssueCategoryRequest;
import com.waterreportsystem.backend.dto.IssueCategoryResponse;
import com.waterreportsystem.backend.entity.IssueCategory;
import com.waterreportsystem.backend.exception.ResourceNotFoundException;
import com.waterreportsystem.backend.repository.IssueCategoryRepository;
import com.waterreportsystem.backend.service.IssueCategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssueCategoryServiceImpl implements IssueCategoryService {

    private final IssueCategoryRepository issueCategoryRepository;

    public IssueCategoryServiceImpl(IssueCategoryRepository issueCategoryRepository) {
        this.issueCategoryRepository = issueCategoryRepository;
    }

    @Override
    public IssueCategoryResponse createCategory(IssueCategoryRequest request) {

        IssueCategory category = new IssueCategory();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(request.getActive());

        IssueCategory savedCategory = issueCategoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    public List<IssueCategoryResponse> getAllCategories() {

        return issueCategoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IssueCategoryResponse getCategoryById(Long id) {

        IssueCategory category = issueCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return mapToResponse(category);
    }

    @Override
    public IssueCategoryResponse updateCategory(Long id, IssueCategoryRequest request) {

        IssueCategory category = issueCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(request.getActive());

        IssueCategory updatedCategory = issueCategoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {

        IssueCategory category = issueCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        issueCategoryRepository.delete(category);
    }

    private IssueCategoryResponse mapToResponse(IssueCategory category) {

        IssueCategoryResponse response = new IssueCategoryResponse();

        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setActive(category.isActive());
        response.setCreatedAt(category.getCreatedAt());

        return response;
    }
}

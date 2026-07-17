package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.dto.IssueCategoryRequest;
import com.waterreportsystem.backend.dto.IssueCategoryResponse;
import com.waterreportsystem.backend.service.IssueCategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class IssueCategoryController {

    private final IssueCategoryService issueCategoryService;

    public IssueCategoryController(IssueCategoryService issueCategoryService) {
        this.issueCategoryService = issueCategoryService;
    }

    @PostMapping
    public IssueCategoryResponse createCategory(@Valid @RequestBody IssueCategoryRequest request) {
        return issueCategoryService.createCategory(request);
    }

    @GetMapping
    public List<IssueCategoryResponse> getAllCategories() {
        return issueCategoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public IssueCategoryResponse getCategoryById(@PathVariable Long id) {
        return issueCategoryService.getCategoryById(id);
    }

    @PutMapping("/{id}")
    public IssueCategoryResponse updateCategory(@PathVariable Long id,
                                                @Valid @RequestBody IssueCategoryRequest request) {
        return issueCategoryService.updateCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        issueCategoryService.deleteCategory(id);
    }
}

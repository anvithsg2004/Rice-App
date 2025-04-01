package com.example.rice_backend.service;

import com.example.rice_backend.entity.Category;
import com.example.rice_backend.entity.RiceItem;
import com.example.rice_backend.repository.CategoryRepository;
import com.example.rice_backend.repository.RiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RiceItemService {

    @Autowired
    private RiceItemRepository riceItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public RiceItem saveRiceItem(RiceItem riceItem) {
        RiceItem savedRiceItem = riceItemRepository.save(riceItem);

        String typeName = savedRiceItem.getType();
        if (typeName != null) {
            Optional<Category> optionalCategory = categoryRepository.findByName(typeName);

            Category category = optionalCategory.orElseGet(() -> {
                Category newCategory = new Category();
                newCategory.setName(typeName);
                newCategory.getRiceItems().add(savedRiceItem);
                return categoryRepository.save(newCategory);
            });

            if (!category.getRiceItems().contains(savedRiceItem)) {
                category.getRiceItems().add(savedRiceItem);
                categoryRepository.save(category);
            }
        }

        return savedRiceItem;
    }

    public List<RiceItem> getAllRiceItems() {
        return riceItemRepository.findAll();
    }

    public List<RiceItem> getRiceItemsByType(String type) {
        return riceItemRepository.findByType(type);
    }

    public RiceItem getRiceItemById(String id) {
        Optional<RiceItem> riceItemOptional = riceItemRepository.findById(id);
        return riceItemOptional.orElse(null);
    }

}

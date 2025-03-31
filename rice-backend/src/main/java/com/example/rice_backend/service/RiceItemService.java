package com.example.rice_backend.service;

import com.example.rice_backend.entity.Category;
import com.example.rice_backend.entity.RiceItem;
import com.example.rice_backend.repository.CategoryRepository;
import com.example.rice_backend.repository.RiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RiceItemService {

    @Autowired
    private RiceItemRepository riceItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public RiceItem saveRiceItem(RiceItem riceItem) {
        System.out.println("\n=== Starting saveRiceItem service method ===");
        System.out.println("Input RiceItem: " + riceItem);

        // Save the rice item
        System.out.println("Saving rice item to repository...");
        RiceItem savedRiceItem = riceItemRepository.save(riceItem);
        System.out.println("Saved RiceItem: " + savedRiceItem);

        // Update the category
        String typeName = riceItem.getType();
        System.out.println("Processing category for type: " + typeName);

        if (typeName != null) {
            System.out.println("Looking up category: " + typeName);
            Category category = categoryRepository.findByName(typeName);

            if (category == null) {
                System.out.println("Category not found, creating new one...");
                // Create a new category if it doesn't exist
                category = new Category();
                category.setName(typeName);
                category.setRiceItems(List.of(riceItem.getName()));
                System.out.println("New Category to save: " + category);

                category = categoryRepository.save(category);
                System.out.println("Saved new Category: " + category);
            } else {
                System.out.println("Existing Category found: " + category);
                // Update the existing category
                List<String> riceItems = category.getRiceItems();
                System.out.println("Current rice items in category: " + riceItems);

                if (!riceItems.contains(riceItem.getName())) {
                    System.out.println("Adding new rice item to category: " + riceItem.getName());
                    riceItems.add(riceItem.getName());
                    category.setRiceItems(riceItems);
                    System.out.println("Updated Category to save: " + category);

                    category = categoryRepository.save(category);
                    System.out.println("Updated Category saved: " + category);
                } else {
                    System.out.println("Rice item already exists in category, no update needed");
                }
            }
        } else {
            System.out.println("Type is null, skipping category update");
        }

        System.out.println("=== Completed saveRiceItem service method ===");
        return savedRiceItem;
    }

    public List<RiceItem> getAllRiceItems() {
        return riceItemRepository.findAll();
    }

    public List<RiceItem> getRiceItemsByType(String type) {
        return riceItemRepository.findByType(type);
    }

    public List<RiceItem> getRiceItemsByInStock(boolean inStock) {
        return riceItemRepository.findByInStock(inStock);
    }
}

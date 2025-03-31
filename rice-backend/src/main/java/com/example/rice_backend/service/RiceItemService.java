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
        // Save the rice item
        RiceItem savedRiceItem = riceItemRepository.save(riceItem);

        // Update the category
        String typeName = riceItem.getType();
        if (typeName != null) {
            Category category = categoryRepository.findByName(typeName);
            if (category == null) {
                // Create a new category if it doesn't exist
                category = new Category();
                category.setName(typeName);
                category.setRiceItems(List.of(riceItem.getName()));
                categoryRepository.save(category);
            } else {
                // Update the existing category
                List<String> riceItems = category.getRiceItems();
                if (!riceItems.contains(riceItem.getName())) {
                    riceItems.add(riceItem.getName());
                    category.setRiceItems(riceItems);
                    categoryRepository.save(category);
                }
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

    public List<RiceItem> getRiceItemsByInStock(boolean inStock) {
        return riceItemRepository.findByInStock(inStock);
    }
}

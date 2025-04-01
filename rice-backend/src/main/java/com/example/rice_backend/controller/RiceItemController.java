package com.example.rice_backend.controller;

import com.example.rice_backend.entity.RiceItem;
import com.example.rice_backend.service.RiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rice-items")
@CrossOrigin("*")
public class RiceItemController {

    @Autowired
    private RiceItemService riceItemService;

    @PostMapping
    public ResponseEntity<RiceItem> saveRiceItem(@RequestBody RiceItem riceItem) {
        System.out.println("=== Starting saveRiceItem API call ===");
        System.out.println("Received RiceItem: " + riceItem);

        try {
            RiceItem savedRiceItem = riceItemService.saveRiceItem(riceItem);
            System.out.println("Successfully saved RiceItem with ID: " + savedRiceItem.getId());
            return new ResponseEntity<>(savedRiceItem, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error saving RiceItem: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<RiceItem>> getAllRiceItems() {
        List<RiceItem> riceItems = riceItemService.getAllRiceItems();
        return new ResponseEntity<>(riceItems, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<RiceItem>> getRiceItemsByType(@PathVariable String type) {
        List<RiceItem> riceItems = riceItemService.getRiceItemsByType(type);
        return new ResponseEntity<>(riceItems, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiceItem> getRiceItemById(@PathVariable String id) {
        RiceItem riceItem = riceItemService.getRiceItemById(id);
        if (riceItem == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(riceItem, HttpStatus.OK);
    }

}

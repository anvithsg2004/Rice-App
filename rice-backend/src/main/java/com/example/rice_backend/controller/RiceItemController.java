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
public class RiceItemController {

    @Autowired
    private RiceItemService riceItemService;

    @PostMapping
    public ResponseEntity<RiceItem> saveRiceItem(@RequestBody RiceItem riceItem) {
        RiceItem savedRiceItem = riceItemService.saveRiceItem(riceItem);
        return new ResponseEntity<>(savedRiceItem, HttpStatus.CREATED);
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

    @GetMapping("/in-stock/{inStock}")
    public ResponseEntity<List<RiceItem>> getRiceItemsByInStock(@PathVariable boolean inStock) {
        List<RiceItem> riceItems = riceItemService.getRiceItemsByInStock(inStock);
        return new ResponseEntity<>(riceItems, HttpStatus.OK);
    }
}

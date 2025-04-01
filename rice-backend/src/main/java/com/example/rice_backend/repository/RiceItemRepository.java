package com.example.rice_backend.repository;

import com.example.rice_backend.entity.RiceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiceItemRepository extends MongoRepository<RiceItem, String> {
    List<RiceItem> findByType(String type);
}

package com.nus_iss.spring.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nus_iss.spring.backend.dtos.ReviewDto;
import com.nus_iss.spring.backend.entities.Review;
import com.nus_iss.spring.backend.services.ReviewServiceImpl;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewServiceImpl reviewService;

    @PostMapping("/write")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER')")
    public ResponseEntity<Review> writeReview(@RequestBody ReviewDto review) {
        Review savedReview = reviewService.writeReview(review);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BUYER', 'ROLE_SELLER')")
    public ResponseEntity<List<ReviewDto>> searchReviews(@PathVariable Long productId) {
        System.out.println("Controller Recevied Product ID: " + productId);
        List<ReviewDto> reviews = reviewService.searchReviews(productId);
        System.out.println("Controller Reviews: " + reviews);
        return ResponseEntity.ok(reviews);
    }
}

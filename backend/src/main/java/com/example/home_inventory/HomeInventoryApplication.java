package com.example.home_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HomeInventoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(HomeInventoryApplication.class, args);
	}

}

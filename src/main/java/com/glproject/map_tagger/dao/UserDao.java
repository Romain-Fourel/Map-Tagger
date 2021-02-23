package com.glproject.map_tagger.dao;

import java.util.List;

public interface UserDao {
	
	/**
	 * Add a new user to the database
	 * @param user
	 */
	void addUser(User user);
	
	/**
	 * 
	 * @param id of the user
	 * @return the user who has id for his ID
	 */
	User getUser(int id);
	
	/**
	 * 
	 * @param radius
	 * @return all places next to the user in the radius.
	 */
	List<Place> getPlaceNear(int radius);
}










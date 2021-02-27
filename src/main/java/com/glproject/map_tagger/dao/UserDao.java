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
	 * @return all users in the database
	 */
	List<User> getUsers();
	
	/**
	 * TODO: maybe the attribute name could be a primary key
	 * @param id of the user
	 * @return the users who has a specific name
	 */
	List<User> getUsers(String name);
	
}










package com.glproject.map_tagger.dao;

import java.util.List;

public interface UserDao {
	
	/**
	 * Add a new user to the database
	 * @param user
	 */
	void addUser(User user);
	
	void delete(User user);
	/**
	 * 
	 * @return all users in the database
	 */
	List<User> getUsers();
	
	/**
	 * TODO: the attribute "name" will be a primary key
	 * So his method will returns a simple user, not a list
	 * @param name of the user
	 * @return the users who has a specific name
	 */
	List<User> getUsers(String name);
	
}










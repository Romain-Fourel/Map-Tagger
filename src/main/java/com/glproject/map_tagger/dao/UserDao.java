package com.glproject.map_tagger.dao;

import java.util.List;

public interface UserDao {
	
	
	/**
	 * 
	 * @return all users in the database
	 */
	List<User> getUsers();
	
	
	/**
	 * 
	 * @param ID is a primary key
	 * @return the only user who has this specific key
	 */
	User getUser(Long ID);


	/**
	 * 
	 * @param name
	 * @return all users who have this specific name 
	 */
	List<User> getUsers(String name);
	

	/**
	 * Add a new user to the database
	 * 
	 * @param user
	 * @return 
	 */
	User addUser(User user);
	
	User updateUser(User user);

	void delete(User user);
	

}

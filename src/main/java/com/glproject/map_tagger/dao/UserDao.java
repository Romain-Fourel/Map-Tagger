package com.glproject.map_tagger.dao;

import java.util.List;

public interface UserDao {

	/**
	 * Add a new user to the database
	 * 
	 * @param user
	 * @return 
	 */
	User addUser(User user);
	
	Map addMapTo(Long userId, Map map);

	void delete(User user);

	/**
	 * 
	 * @param ID is a primary key
	 * @return the only user who has this specific key
	 */
	User getUser(Long ID);

	/**
	 * 
	 * @return all users in the database
	 */
	List<User> getUsers();

	/**
	 * 
	 * @param name
	 * @return all users who have this specific name 
	 */
	List<User> getUsers(String name);

}

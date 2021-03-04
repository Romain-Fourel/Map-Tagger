package com.glproject.map_tagger.dao;

import java.util.List;

public interface UserDao {

	/**
	 * Add a new user to the database
	 * 
	 * @param user
	 */
	void addUser(User user);

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
	 * @return all users in which their name contains the word "name"
	 */
	List<User> getUsers(String name);

}

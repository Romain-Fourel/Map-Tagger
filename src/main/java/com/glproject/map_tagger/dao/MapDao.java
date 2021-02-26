package com.glproject.map_tagger.dao;

import java.util.List;

public interface MapDao {
	
	/**
	 * Add a new map to the database
	 * @param map
	 */
	void addMap(Map map);
	
	
	/**
	 * Get all maps of the database
	 * @return
	 */
	List<Map> getMaps();
	
	
	/**
	 * Get all maps of a user
	 * @param user
	 * @return
	 */
	List<Map> getMaps(User user);
	
	/**
	 * 
	 * @param name of the map
	 * @return the map which has a specific name
	 */
	Map getMap(String name);

}

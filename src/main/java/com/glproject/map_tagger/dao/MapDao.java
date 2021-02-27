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
	 * 
	 * @param name of the map
	 * @return the map which has a specific name
	 */
	List<Map> getMaps(String name);

}

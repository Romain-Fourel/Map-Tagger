package com.glproject.map_tagger.dao;

import java.util.List;

public interface MapDao {

	
	/**
	 * Get all maps of the database
	 * 
	 * @return
	 */
	List<Map> getMaps();
	
	/**
	 * get the map by its unique id
	 * @param ID
	 * @return
	 */
	Map getMap(Long ID);
	
	/**
	 * Get all public maps in the database
	 * @return
	 */
	List<Map> getPublicMaps();
	
	/**
	 * 
	 * @param name of the map
	 * @return the map in which its name contains "name" or all creators who has
	 *         "name" into their user name
	 */
	List<Map> getMaps(String name);
	
	
	
	Map addMapTo(Long userId, Map map);

	Map addMapSharedTo(Long userId, Map map);
	
	
	Map updateMap(Map map);

	void delete(Map map);

	
	
}

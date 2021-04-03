package com.glproject.map_tagger.dao;

import java.util.List;

public interface MapDao {

	/**
	 * Add a new map to the database
	 * 
	 * @param map
	 * @return 
	 */
	Map addMap(Map map);
	
	Map updateMap(Map map);

	void delete(Map map);

	/**
	 * Get all maps of the database
	 * 
	 * @return
	 */
	List<Map> getMaps();

	Map getMap(Long ID);

	List<Map> getPublicMaps();

	/**
	 * 
	 * @param name of the map
	 * @return the map in which its name contains "name" or all creators who has
	 *         "name" into their user name
	 */
	List<Map> getMaps(String name);
	
	/**
	 * get the map which contains a specific place
	 * @param place
	 * @return
	 */
	Map getMapOf(Place place);

	Map addMapTo(Long userId, Map map);
		

}

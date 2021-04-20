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
	
	
	Map addMapTo(Long userId, Map map);

	Map addSharedMapTo(Long userId, Map map);
	
	
	Map updateMap(Map map);

	User deleteMapTo(Long userId, Map map);

	
	
}

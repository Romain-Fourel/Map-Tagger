package com.glproject.map_tagger.dao;

import java.util.List;

public interface MapDao {
	
	List<Map> getMaps();
	
	/**
	 * 
	 * @param id of the map
	 * @return the map which have map.id=id
	 */
	Map getMap(int id);

}

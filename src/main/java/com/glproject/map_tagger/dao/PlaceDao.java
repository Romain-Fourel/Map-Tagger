package com.glproject.map_tagger.dao;

import java.util.List;

public interface PlaceDao {

	/**
	 * Add a new place to the database
	 * @param user
	 */
	void addPlace(Place place);
	
	
	/**
	 * 
	 * @return all places in the database
	 */
	List<Place> getPlaces();
	
	/**
	 * Get all places of a user
	 * @param user
	 * @return
	 */
	List<Place> getPlaces(User user);
	
	/**
	 * 
	 * @param map
	 * @return
	 */
	List<Place> getPlaces(Map map);
	
	/**
	 * 
	 * @return all places in the database which has tag in their tag list
	 */
	List<Place> getPlaces(List<String> tag);
	
	
	/**
	 * 
	 * @param location
	 * @param radius
	 * @return returns all places next to the location in the radius
	 */
	List<Place> getPlaceNear(String location, int radius);
	
	Place getPlace(String name);	

}

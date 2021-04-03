package com.glproject.map_tagger.dao;

import java.util.List;

public interface PlaceDao {

	/**
	 * Add a new place to the database
	 * 
	 * @param user
	 * @return 
	 */
	Place addPlace(Place place);
	
	Place updatePlace(Place place);

	void delete(Place place);

	/**
	 * 
	 * @return all places in the database
	 */
	List<Place> getPlaces();

	Place getPlace(Long ID);

	
	/**
	 * 
	 * @param name
	 * @return all places in which their name contains "name"
	 */
	List<Place> getPlaces(String name);


	Place addPlaceTo(Long mapId, Place place);

}

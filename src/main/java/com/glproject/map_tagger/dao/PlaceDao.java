package com.glproject.map_tagger.dao;

import java.util.List;

public interface PlaceDao {

	
	/**
	 * 
	 * @return all places in the database
	 */
	List<Place> getPlaces();

	Place getPlace(Long ID);
	
	Place addPlaceTo(Long mapId, Place place);
	
	Place updatePlace(Place place);

	Map deletePlaceTo(Long mapId, Place place);



}

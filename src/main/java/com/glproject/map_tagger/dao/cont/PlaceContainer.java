package com.glproject.map_tagger.dao.cont;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.glproject.map_tagger.dao.Place;

@PersistenceCapable
public class PlaceContainer {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
	protected Long id = null;

	protected List<Place> Places = null;

	public PlaceContainer() {
		super();
		Places = new ArrayList<Place>();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Place> getPlaces() {
		return Places;
	}

	public void setPlaces(List<Place> places) {
		Places = places;
	}
}

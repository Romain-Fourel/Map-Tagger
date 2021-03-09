package com.glproject.map_tagger.dao;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * This class represent maps that users can create and edit.
 *
 */
@PersistenceCapable
public class Map {

	public enum Confidentiality {
		PRIVATE, PUBLIC
	}

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
	protected Long ID = null;

	String name;

	final String creator;

	Boolean isVisible;

	Confidentiality confidentiality;
	List<Place> places;
	String description;

	public Map(String creator) {
		super();
		isVisible = true;
		this.creator = creator;
		confidentiality = Confidentiality.PRIVATE;
		places = new ArrayList<Place>();
	}
	
	public Map(String creator, String name) {
		this(creator);
		this.name = name;
	}

	public Long getID() {
		return ID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getIsVisible() {
		return isVisible;
	}

	public void setIsVisible(Boolean isVisible) {
		this.isVisible = isVisible;
	}

	public String getCreator() {
		return creator;
	}

	public Confidentiality getConfidentiality() {
		return confidentiality;
	}

	public void setConfidentiality(Confidentiality confidentiality) {
		this.confidentiality = confidentiality;
	}

	public List<Place> getPlaces() {
		return places;
	}

	public void setPlaces(List<Place> places) {
		this.places = places;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public void addPlace(Place place) {
		places.add(place);
	}
	
	@Override
	public String toString() {
		return name+" #"+ID;
	}

}

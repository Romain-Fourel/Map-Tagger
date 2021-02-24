package com.glproject.map_tagger.dao;

import java.util.List;

import javax.jdo.annotations.PersistenceCapable;

/**
 * This class represent maps that users can create and edit.
 * @author romain
 *
 */
@PersistenceCapable
public class Map {
	
	public enum Confidentiality {
		PRIVATE,
		PUBLIC
	}
	
	String name;
	
	Confidentiality confidentiality;
	List<Place> places;
	String description;
	

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	
}

package com.glproject.map_tagger.dao;

import java.util.List;

import javax.jdo.annotations.PersistenceCapable;

/**
 * This class represent maps that users can create and edit.
 *
 */
@PersistenceCapable
public class Map {
	
	public enum Confidentiality {
		PRIVATE,
		PUBLIC
	}
	
	//primary key
	Long ID;
	
	String name;
	
	final String creator;
	
	Boolean isVisible;
	
	Confidentiality confidentiality;
	List<Place> places;
	String description;
	
	public Map(String creator) {
		isVisible = true;
		this.creator = creator;
	}
	
	
	public Long getID() {
		return ID;
	}
	public void setID(Long iD) {
		ID = iD;
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
	
}

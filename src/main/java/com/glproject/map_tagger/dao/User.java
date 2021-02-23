package com.glproject.map_tagger.dao;

import java.util.List;

import javax.jdo.annotations.PersistenceCapable;

/**
 * This class represent a user in our Map tagger Application
 * @author romain
 *
 */
@PersistenceCapable
public class User {
	
	int id;
	List<Map> mapList;
	
	//for now, the location is in a string, maybe a class can be used to handle this better
	String location;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Map> getMapList() {
		return mapList;
	}

	public void setMapList(List<Map> mapList) {
		this.mapList = mapList;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	
	
}

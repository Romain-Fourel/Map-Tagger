package com.glproject.map_tagger.dao;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.PersistenceCapable;

/**
 * This class represent a user in our Map tagger Application
 * @author romain
 *
 */
@PersistenceCapable
public class User {
	
	String name;
	List<Map> mapList;
	
	//for now, the location is in a string, maybe a class can be used to handle this better
	String location;
	
	public User() {}
	
	public User(String name) {
		this.name = name;
		mapList = new ArrayList<Map>();
		location = null;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

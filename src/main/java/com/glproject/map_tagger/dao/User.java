package com.glproject.map_tagger.dao;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * This class represent a user in our Map Tagger Application
 * 
 * @author romain
 *
 */
@PersistenceCapable
public class User {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
	protected Long ID = null;

	String name;
	String password;
	List<Map> mapList;

	public User() {
		super();
	}

	public User(String name) {
		super();
		this.name = name;
		mapList = new ArrayList<Map>();
	}
	
	public User(String name, String password) {
		this(name);
		this.password = password;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<Map> getMapList() {
		return mapList;
	}

	public void setMapList(List<Map> mapList) {
		this.mapList = mapList;
	}
	
	/**
	 * Add a map to the map list of the user
	 * @param map
	 */
	public void addMap(Map map) {
		mapList.add(map);
	}
	
	/**
	 * return true if the user has this specific password
	 * @param password: the password tested
	 * @return
	 */
	public boolean hasPassword(String password) {
		return this.password.equals(password);
	}
	
	/**
	 * Every user has is toString() unique
	 */
	@Override
	public String toString() {
		return name + " #"+ID;
	}

}




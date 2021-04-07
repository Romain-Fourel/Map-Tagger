package com.glproject.map_tagger.dao;

import java.util.ArrayList;
import java.util.HashMap;
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
	
	HashMap<Long, Boolean> mapsVisibility;
	
	List<Map> mapsShared; //map shared by other users, waiting for an answer

	public User() {
		super();
	}

	public User(String name) {
		super();
		this.name = name;
		mapList = new ArrayList<Map>();
		mapsVisibility = new HashMap<Long, Boolean>();
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
	
	
	
	public HashMap<Long, Boolean> getMapsVisibility() {
		return mapsVisibility;
	}

	public void setMapsVisibility(HashMap<Long, Boolean> mapsVisibility) {
		this.mapsVisibility = mapsVisibility;
	}

	public List<Place> getPlaces(){
		if (mapList == null) {
			return null;
		}
		List<Place> places = new ArrayList<Place>();
		for (Map map : mapList) {
			if (map.places != null) {
				places.addAll(map.places);
			}		
		}
		return places;
	}
	
	
	
	
	public List<Map> getMapsShared() {
		return mapsShared;
	}

	public void setMapsShared(List<Map> mapsShared) {
		this.mapsShared = mapsShared;
	}

	/**
	 * Add a map to the map list of the user
	 * @param map
	 */
	public void addMap(Map map) {
		if(mapList == null) {
			mapList = new ArrayList<Map>();
		}
		mapList.add(map);
		mapsVisibility.put(map.getID(), true);
	}
	
	public void removeMap(Map map) {
		for (int i = 0; i < mapList.size(); i++) {
			if (mapList.get(i).equals(map)) {
				mapList.remove(i);
				return;
			}
		}
	}
	
	public void addMapShared(Map map) {
		if(mapsShared == null) {
			mapsShared = new ArrayList<Map>();
		}
		mapsShared.add(map);
	}
	
	public void removeMapShared(Map map) {
		for (int i = 0; i < mapsShared.size(); i++) {
			if (mapsShared.get(i).equals(map)) {
				mapsShared.remove(i);
				return;
			}
		}
	}
	
	public void setVisibilityOf(long mapId,boolean visibility) {
		
		if (mapsVisibility==null) {
			mapsVisibility = new HashMap<Long, Boolean>();
		}
		
		mapsVisibility.put(mapId, visibility);
	}
	
	public boolean getVisibilityOf(long mapId) {
		return mapsVisibility.get(mapId);
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


	public String toCompleteString() {
		return "User [ID=" + ID + ", name=" + name + ", password=" + password + ", mapList=" + mapList
				+ ", mapsVisibility=" + mapsVisibility + ", mapsShared=" + mapsShared + "]";
	}
	
	@Override
	public boolean equals(Object obj) {
		User user = (User) obj;
		return getID().equals(user.getID());
	}
	


}




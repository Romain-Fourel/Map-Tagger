package com.glproject.map_tagger.dao;

import com.glproject.map_tagger.dao.impl.MapDaoImpl;
import com.glproject.map_tagger.dao.impl.PlaceDaoImpl;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DAO {
	
	public static UserDao getUserDao() {
		return new UserDaoImpl();
	}
	
	public static MapDao getMapDao() {
		return new MapDaoImpl();
	}
	
	public static PlaceDao getPlaceDao() {
		return new PlaceDaoImpl();
	}
}

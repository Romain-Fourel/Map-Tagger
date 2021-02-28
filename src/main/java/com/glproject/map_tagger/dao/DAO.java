package com.glproject.map_tagger.dao;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import com.glproject.map_tagger.dao.impl.MapDaoImpl;
import com.glproject.map_tagger.dao.impl.PlaceDaoImpl;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DAO {
	
	//TODO, how to put a real persistentManagerFactory??
	public static UserDao getUserDao() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		return new UserDaoImpl(pmf);
	}
	
	public static MapDao getMapDao() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		return new MapDaoImpl(pmf);
	}
	
	public static PlaceDao getPlaceDao() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		return new PlaceDaoImpl(pmf);
	}
}

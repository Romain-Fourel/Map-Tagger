package com.glproject.map_tagger.dao;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import com.glproject.map_tagger.dao.impl.MapDaoImpl;
import com.glproject.map_tagger.dao.impl.PlaceDaoImpl;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DAO {
	
	/**
	 * Just to put fake objects into the database in order to test
	 * features of the application
	 */
	public static void generateFakeObjects() {
		User user = new User("Jean","123456","paris");
		
		Map map = new Map("Jean","Gardens of Paris");
		map.setDescription("All gardens I have visited during my holidays in Paris");
		
		user.addMap(map);
		
		Place place = new Place("Pretty garden","Paris");
		place.setDescription("A pretty garden in Paris");
		place.addTag("nature");
		place.addTag("Green");
		
		map.addPlace(place);
		
		getUserDao().addUser(user);
		
		User user2 = new User("Alfred","alfred123456","London");
		Map map2 = new Map("Alfred","Gardens of London");
		map2.setDescription("All gardens I have visited during my holidays in London");
		user2.addMap(map2);
		
		Place place2 = new Place("Pretty garden","London");
		place2.setDescription("A pretty garden in London");
		place2.addTag("nature");
		place2.addTag("England");
		
		map2.addPlace(place2);
		
		getUserDao().addUser(user2);
		
		
		User auriane = new User("enairuA","Camelias1408","Alfortville");
		getUserDao().addUser(auriane);
		
	}
	
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

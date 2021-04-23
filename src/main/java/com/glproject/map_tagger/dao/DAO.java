package com.glproject.map_tagger.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import com.glproject.map_tagger.dao.Map.Confidentiality;
import com.glproject.map_tagger.dao.impl.MapDaoImpl;
import com.glproject.map_tagger.dao.impl.PlaceDaoImpl;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DAO {
	
	
	static PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
	
	public static PersistenceManagerFactory getPmf() {
		return pmf;
	}
	
	
	public static void generateUsers() {
		
		int nbUsers = 10;
		int nbPlacesPerUser = 7;
		
		double latitude = 48.858;
		double longitude = 2.344;
		double precision  = 0.1;
		
		
		List<List<String[]>> tags = new ArrayList<List<String[]>>();
		
		for (int i = 0; i < nbUsers; i++) {
			List<String[]> list = new ArrayList<>();
			for (int j = 0; j < nbPlacesPerUser; j++) {
				String[] tagsTab = {"tag"+i+""+j,"tagi"+i,"tagj"+j,"tagmod"+i%3,"tagdiv4"+i/4,"tagdiv3"+i/3,"tag"};
				list.add(tagsTab);
			}
			tags.add(list);
		}
		
		List<List<String>> messages = new ArrayList<List<String>>();
		
		for (int i = 0; i < nbUsers; i++) {
			List<String> list = new ArrayList<>();
			for (int j = 0; j < nbPlacesPerUser; j++) {
				list.add("message "+i+","+j);
			}
			messages.add(list);
		}
		
		for (int i = 0; i < nbUsers; i++) {
			User user = new User("user"+i, "password"+i);
			User userDetached = getUserDao().addUser(user);	
			long userId = userDetached.getId();
			
			Map map = new Map(userId, "map"+i);
			map.setDescription("description of map"+i);
			map.setConfidentiality(Confidentiality.PUBLIC);
			Map detached = getMapDao().addMapTo(userId, map);
			long mapId = detached.getID();
			getMapDao().addSharedMapTo((long) 0, detached);
			
			for (int j = 0; j < nbPlacesPerUser; j++) {
				Place place = new Place("Place "+i+","+j);
				place.setDescription("description of place "+i+","+j);
				place.setTags(Arrays.asList(tags.get(i).get(j)));
				place.setMessages(messages.get(i));
				place.setLatitude(latitude+precision*i);
				place.setLongitude(longitude+precision*j);
				getPlaceDao().addPlaceTo(mapId, place);
			}
			
		}	
	}
	
	
	
	
	public static UserDao getUserDao() {
		return new UserDaoImpl(pmf);
	}

	public static MapDao getMapDao() {
		return new MapDaoImpl(pmf);
	}

	public static PlaceDao getPlaceDao() {
		return new PlaceDaoImpl(pmf);
	}
}

package com.glproject.map_tagger.dao;

import java.util.Arrays;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import com.glproject.map_tagger.dao.Map.Confidentiality;
import com.glproject.map_tagger.dao.impl.MapDaoImpl;
import com.glproject.map_tagger.dao.impl.PlaceDaoImpl;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;
import com.glproject.map_tagger.ws.UserResource;

public class DAO {
	
	
	static PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
	
	public static PersistenceManagerFactory getPmf() {
		return pmf;
	}
	
	
	/**
	 * Just to put fake objects into the database in order to test
	 * features of the application
	 */
	public static void generateFakeUser() {
	
		User user = new User("Romain", "24071999");
		
		double[][][] locations = {{{47.387452, 0.678244},{47.387648, 0.666612},{47.381151, 0.663797}},
								  {{47.512352, 1.455964},{47.508095, 1.453173},{47.512779, 1.459159}},
								  {{48.802605, 2.42433},{48.868944, 2.334906},{48.85747, 2.359041}},
								  {{45.740027, 4.871898},{45.781056, 4.850082},{45.456536, 4.778787}}
								 };
		String[] mapNames = {"Tours","Cour-Cheverny","Paris","Lyon"};
		
		String[][][] tags = {{{"appartement","centre-ville","9m²"},{"jardin","botanique"},{"université","bretonneau"}},
				             {{"transport","bus"},{"parking","cascade","arbres"},{"butte","étang","hérissons"}},
				             {{"appartement","32m²"},{"restaurant","japonais"},{"restaurant","falafel","Marais"}},
				             {{"tag1","tag2","tag3"},{"tag1","tag3","tag4"},{"tag2","tag4","tag5"}}};
		
		
		
		for (int i = 0; i < 4; i++) {
			Map map = new Map("user1");
			map.setName(mapNames[i]);
			for (int j = 0; j < 3; j++) {
				Place place = new Place("Place"+i+""+j);
				place.setLocation(locations[i][j][0],locations[i][j][1]);
				place.setDescription("description"+i+""+j);
				place.setTags(Arrays.asList(tags[i][j]));
				
				String[] messages = {"message ("+i+","+j+",1)","message ("+i+","+j+",2)","message ("+i+","+j+",3)"};
				place.setMessages(Arrays.asList(messages));
				
				map.addPlace(place);
			}
			if(i==0) {
				map.setVisibility(false);
			}
			map.setDescription("description"+i);
			user.addMap(map);
		}
		
		getUserDao().addUser(user);
		
		UserResource.setCurrentSession(user.getID());
		
	}
	
	
	
	public static void generateManyFakeUsers() {
		
		for (int i = 0; i < 10; i++) {
			User user = new User("user"+i, "password"+i);
			
			Map map = new Map("user"+i, "map"+i);
			map.setDescription("description of map"+i);
			map.setConfidentiality(Confidentiality.PUBLIC);
			
			for (int j = 0; j < 7; j++) {
				Place place = new Place("Place "+i+","+j);
				place.setDescription("description of place "+i+","+j);
				map.addPlace(place);
			}
			user.addMap(map);
			getUserDao().addUser(user);	
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
